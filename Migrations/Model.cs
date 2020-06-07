using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Text;

namespace Migrations
{
    //class Model
    //{
    //}

    public class BlogContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }
    }

    public class Blog
    {
        public int BlogId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}