using System;
using track_api.Models.Db;

namespace DatabaseUpdate
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var db = new ModelContext())
            {
                db.Users.Add(new User { Username = "turkeymaster77@gmail.com" });
                //    db.Blogs.Add(new Blog { Name = "Another Blog " });
                db.SaveChanges();

                //    foreach (var blog in db.Blogs)
                //    {
                //        Console.WriteLine(blog.Name);
                //    }
            }
        }
    }
}
