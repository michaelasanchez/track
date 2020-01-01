using System;
using System.Web.Mvc;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;

using track.Utils;  // JSONAdapater

namespace track.Controllers
{
    public class AdminController : Controller
    {
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CreateUser()
        {
            // Return new user id or 0
            return Json(DatabaseManager.createUser("admin", "asdf"), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CopyToDatabase()
        {
            // data.json file
            string path = Server.MapPath("~/data.json");

            // Pass true to commit to database
            JSONAdapter adapter = new JSONAdapter(path, true);

            // Return # of datasets
            return Json(adapter.getDatasets().Count, JsonRequestBehavior.AllowGet);
        }

        // Make sure database connectivity exists
        public JsonResult TestDatabase()
        {
            string returnString;
            try
            {
                returnString = DatabaseManager.testConnection();
            }
            catch (Exception ex)
            {
                returnString = ex.ToString();
            }
            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        // Makes sure call to controller is functional
        public JsonResult Test()
        {
            return Json("controller works", JsonRequestBehavior.AllowGet);
        }
    }

    public static class DatabaseManager
    {
        private static string connString = ConfigurationManager.ConnectionStrings["track"].ConnectionString;

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
    }

}