using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
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

        public static int createDataset(int userId, string label, List<string> seriesLabels, List<int> typeIds)
        {
            int datasetId = 0;

            using (SqlConnection conn = new SqlConnection(connString))
            {
                try
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("CreateDataset", conn) { CommandType = CommandType.StoredProcedure };

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

                } catch (Exception ex)
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

            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                // Get label of dataset with matching id
                SqlCommand cmd = new SqlCommand("GetSeries", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));

                // TODO: Fix so detects if null or more than 1
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        datasetLabel = reader.GetString(reader.GetOrdinal("Label"));
                    }
                }


                // Get dataset series list
                cmd = new SqlCommand("GetSeries", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));

                // TODO: Create & use Series instance
                List<int> seriesIdList = new List<int>();
                List<string> seriesList = new List<string>();
                List<string> seriesTypeList = new List<string>();
                List<string> seriesColorList = new List<string>();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int seriesId = reader.GetInt32(reader.GetOrdinal("SeriesId"));
                        seriesIdList.Add(seriesId);

                        string seriesLabel = reader.GetString(reader.GetOrdinal("Label"));
                        seriesList.Add(seriesLabel);

                        string seriesType = reader.GetString(reader.GetOrdinal("SeriesType"));
                        seriesTypeList.Add(seriesType);

                        if (reader.IsDBNull(reader.GetOrdinal("Color")))
                        {
                            seriesColorList.Add(null);
                        }
                        else
                        {
                            string seriesColor = reader.GetString(reader.GetOrdinal("Color"));
                            seriesColorList.Add(seriesColor);
                        }
                    }
                }

                //
                dataset = new Dataset(datasetLabel, seriesIdList, seriesList, seriesTypeList, seriesColorList);


                // Get records with matching dataset id
                cmd = new SqlCommand("GetRecords", conn) { CommandType = CommandType.StoredProcedure };
                cmd.Parameters.Add(new SqlParameter("@Id", datasetId));

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Dictionary<string, object> props = new Dictionary<string, object>();

                        DateTime dt = reader.GetDateTime(reader.GetOrdinal("DateTime"));
                        string propString = reader.GetString(reader.GetOrdinal("Properties"));
                        string note = "";
                        if (!reader.IsDBNull(reader.GetOrdinal("Text")))
                            note = reader.GetString(reader.GetOrdinal("Text"));

                        var test = propString.Split(';');

                        foreach (var p in test)
                        {
                            int colon = p.IndexOf(':');
                            string key = p.Substring(1, colon - 1);
                            string val = p.Substring(colon + 1, p.Length - colon - 1);

                            if (props.ContainsKey(key))
                            {
                                props[key] = val;
                            }
                            else
                            {
                                props.Add(key, val);
                            }
                        }

                        if (!string.IsNullOrEmpty(note))
                            dataset.createRecord(dt, props, note);
                        else
                            dataset.createRecord(dt, props);

                    }
                }
            }

            return dataset;
        }

        public static void saveRecord(int datasetId, List<string> labels, List<string> values, DateTime datetime, string note = "")
        {
            using (SqlConnection conn = new SqlConnection(connString))
            {
                conn.Open();

                // Create record entry
                SqlCommand cmd = new SqlCommand("CreateRecord", conn) { CommandType = CommandType.StoredProcedure };

                cmd.Parameters.Add(new SqlParameter("@DatasetId", datasetId));
                cmd.Parameters.Add(new SqlParameter("@DateTime", datetime.ToString()));
                if (!string.IsNullOrEmpty(note)) cmd.Parameters.Add(new SqlParameter("@Note", note));

                int recordId = Convert.ToInt32(cmd.ExecuteScalar());

                // Add properties
                for (var i = 0; i < labels.Count; i++)
                {
                    cmd = new SqlCommand("AddProperty", conn) { CommandType = CommandType.StoredProcedure };

                    cmd.Parameters.Add(new SqlParameter("@RecordId", recordId));
                    cmd.Parameters.Add(new SqlParameter("@Label", labels[i]));
                    cmd.Parameters.Add(new SqlParameter("@Value", values[i]));

                    cmd.ExecuteNonQuery();
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