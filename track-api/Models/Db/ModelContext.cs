namespace track_api.Models.Db
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Data.Entity.Infrastructure;

    public partial class ModelContext : DbContext
    {
        public ModelContext()
            : base("name=ModelContext")
        {
            var objectContext = ((IObjectContextAdapter)this).ObjectContext;
            objectContext.SavingChanges += UpdateDatedEntity;
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

        protected void UpdateDatedEntity(object sender, EventArgs args)
        {
            var now = DateTimeOffset.Now;

            foreach (var entry in this.ChangeTracker.Entries<IDatedEntity>())
            {
                var entity = entry.Entity;
                switch (entry.State)
                {
                    case EntityState.Added:
                        entity.Created = now;
                        entity.Updated = now;
                        break;
                    case EntityState.Modified:
                        entity.Updated = now;
                        break;
                }
            }
            this.ChangeTracker.DetectChanges();
        }
    }
}
