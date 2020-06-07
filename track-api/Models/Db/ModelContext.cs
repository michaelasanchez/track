namespace track_api.Models.Db
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ModelContext : DbContext
    {
        public ModelContext()
            : base("name=ModelContext")
        {
        }

        public virtual DbSet<Dataset> Datasets { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<Property> Properties { get; set; }
        public virtual DbSet<Record> Records { get; set; }
        public virtual DbSet<Series> Series { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Dataset>()
                .Property(e => e.Label)
                .IsUnicode(false);

            modelBuilder.Entity<Note>()
                .Property(e => e.Text)
                .IsUnicode(false);

            modelBuilder.Entity<Property>()
                .Property(e => e.Value)
                .IsUnicode(false);

            modelBuilder.Entity<Series>()
                .Property(e => e.Label)
                .IsUnicode(false);

            modelBuilder.Entity<Series>()
                .Property(e => e.Color)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Series>()
                .Property(e => e.Unit)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Username)
                .IsUnicode(false);
        }
    }
}
