using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Text;
using track.Models;

namespace track.Utils
{

    public static class DatabaseManager
    {
        private static string connString = ConfigurationManager.ConnectionStrings["track"].ConnectionString;


        // *TEMP* - make sure database d
        public static string testConnection()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    SqlCommand cmd;
                    SqlDataReader r;

                    conn.Open();

                    cmd = new SqlCommand("SELECT COUNT(*) FROM [User]", conn);
                    r = cmd.ExecuteReader();

                    while (r.Read())
                    {
                        // Connection works at this point or will throw exception
                    }
                }

                return "200";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        // *TEMP* - Add default admin user
        public static int createUser(string username, string password)
        {
            int userId = 0, userCount;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM [User] WHERE [Username]='" + username + "'", conn);
                userCount = (int)cmd.ExecuteScalar();

                // If username already exists
                if (userCount > 0)
                {
                    return 0;

                }
                // Otherwise, create new user
                else
                {

                    cmd = new SqlCommand("INSERT INTO [User] ([Username], [Password]) VALUES ('" + username + "', '" + CalculateMD5Hash(password) + "')", conn);
                    cmd.ExecuteNonQuery();

                    cmd = new SqlCommand("SELECT [Id] FROM [User] WHERE [Username]='" + username + "'", conn);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            userId = reader.GetInt32(reader.GetOrdinal("id"));
                        }
                    }
                }
            }

            return userId;
        }

        // Return dictionary <id, label> of all datasets
        public static Dictionary<int, string> getDatasetLabels()
        {
            Dictionary<int, string> datasetDict = new Dictionary<int, string>();

            using (SqlConnection conn = new SqlConnection(connString))
            {
                try
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("GetDatasets", conn) { CommandType = CommandType.StoredProcedure };

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            datasetDict.Add(reader.GetInt32(reader.GetOrdinal("Id")), reader.GetString(reader.GetOrdinal("Label")));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.ToString());
                }
            }

            return datasetDict;
        }

        // Create dataset & associated series
        public static int createDataset(int userId, string label, List<string> seriesLabels, List<int> typeIds)
        {
            SqlCommand cmd;
            int datasetId = 0;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                try
                {
                    conn.Open();
                    cmd = new SqlCommand("CreateDataset", conn) { CommandType = CommandType.StoredProcedure };

                    // Create dataset
                    cmd.Parameters.Add(new SqlParameter("@UserId", userId));
                    cmd.Parameters.Add(new SqlParameter("@Label", label));
                    datasetId = Convert.ToInt32(cmd.ExecuteScalar());

                    for (int i = 0; i < seriesLabels.Count; i++)
                    {
                        cmd = new SqlCommand("AddSeries", conn) { CommandType = CommandType.StoredProcedure };
                        cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));
                        cmd.Parameters.Add(new SqlParameter("@TypeId", typeIds[i]));
                        cmd.Parameters.Add(new SqlParameter("@Label", seriesLabels[i]));
                        cmd.ExecuteNonQuery();
                    }

                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.ToString());
                }
            }

            return datasetId;
        }

        // Return dataset object by id
        public static Dataset getDataset(int datasetId)
        {
            Dataset dataset;
            string datasetLabel = "";

            List<int> seriesIds;

            Dictionary<int, object> properties;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                // Get label of dataset with matching id
                using (SqlCommand cmd = new SqlCommand("GetDataset", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@Id", datasetId));

                    // TODO: Fix so detects if null or more than 1
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        reader.Read();
                        datasetLabel = reader.GetString(reader.GetOrdinal("Label"));
                    }
                }

                // Create dataset instance
                dataset = new Dataset(datasetLabel);


                // Get dataset series list
                using (SqlCommand cmd = new SqlCommand("GetSeries", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            dataset.addSeries(new Series()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("SeriesId")),
                                Label = reader.GetString(reader.GetOrdinal("Label")),
                                Type = reader.GetString(reader.GetOrdinal("SeriesType")),
                                Color = reader.IsDBNull(reader.GetOrdinal("Color")) ? null : reader.GetString(reader.GetOrdinal("Color"))
                            });
                        }
                    }
                }

                // Get series id list for add properties
                seriesIds = dataset.getSeriesIds();

                // Get records with matching dataset id
                using (SqlCommand cmd = new SqlCommand("GetRecordsFinal", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var temp = reader.GetString(reader.GetOrdinal("Properties")).Split(',');

                            properties = new Dictionary<int, object>();
                            for (int i = 0; i < temp.Count(); i++) properties.Add(seriesIds[i], temp[i]);

                            // Add record to dataset
                            dataset.addRecord(new Record()
                            {
                                DateTime = reader.GetDateTime(reader.GetOrdinal("DateTime")),
                                Properties = properties,
                                Note = reader.IsDBNull(reader.GetOrdinal("Note")) ? null : reader.GetString(reader.GetOrdinal("Note"))
                            });
                        }
                    }
                }

            } // Dispose connection

            return dataset;
        }

        public static void saveRecord(int datasetId, List<string> labels, List<string> values, DateTime datetime, string note = "")
        {
            int recordId;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                // Create record entry
                using (SqlCommand cmd = new SqlCommand("CreateRecord", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));
                    cmd.Parameters.Add(new SqlParameter("@DateTime", datetime.ToString()));
                    if (!string.IsNullOrEmpty(note)) cmd.Parameters.Add(new SqlParameter("@Note", note));

                    recordId = Convert.ToInt32(cmd.ExecuteScalar());
                }


                // Add properties
                using (SqlCommand cmd = new SqlCommand("AddProperty", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@RecordId", 0));
                    cmd.Parameters.Add(new SqlParameter("@Label", ""));
                    cmd.Parameters.Add(new SqlParameter("@Value", ""));

                    for (var i = 0; i < labels.Count; i++)
                    {
                        cmd.Parameters["@RecordId"].Value = recordId;
                        cmd.Parameters["@Label"].Value = labels[i];
                        cmd.Parameters["@Value"].Value = values[i];

                        cmd.ExecuteNonQuery();
                    }
                }

            }

        }

        public static void updateDataset(int datasetId, string label)
        {
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("UpdateDataset", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));
                    cmd.Parameters.Add(new SqlParameter("@Label", label));

                    cmd.ExecuteNonQuery();
                }

            }
        }

        public static void updateSeries(int seriesId, string label = null, string color = null)
        {
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("UpdateSeries", conn) { CommandType = CommandType.StoredProcedure })
                {
                    cmd.Parameters.Add(new SqlParameter("@SeriesId", seriesId));
                    if (label != null)
                        cmd.Parameters.Add(new SqlParameter("@Label", label));
                    if (color != null)
                        cmd.Parameters.Add(new SqlParameter("@Color", color));

                    cmd.ExecuteNonQuery();
                }
            }
        }

        // Utility ------------------------------------------------------------------------------

        private static string CalculateMD5Hash(string input)
        {
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }

                return sb.ToString();
            }
        }
    }
}