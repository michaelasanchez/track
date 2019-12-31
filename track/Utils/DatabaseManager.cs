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
        private static string connString = getConnectionString();

        public static string getConnectionString()
        {
            return ConfigurationManager.ConnectionStrings["track"].ConnectionString;
        }

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

        public static void createRecord(int datasetId, List<string> labels, List<string> values, DateTime datetime, string note = "")
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