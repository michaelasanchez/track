namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDatedProps : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Dataset", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.Dataset", "Updated", c => c.DateTimeOffset(precision: 7));
            AddColumn("dbo.Record", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.Record", "Updated", c => c.DateTimeOffset(precision: 7));
            AddColumn("dbo.Note", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.Note", "Updated", c => c.DateTimeOffset(precision: 7));
            AddColumn("dbo.Property", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.Property", "Updated", c => c.DateTimeOffset(precision: 7));
            AddColumn("dbo.Series", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.Series", "Updated", c => c.DateTimeOffset(precision: 7));
            AddColumn("dbo.User", "Created", c => c.DateTimeOffset(nullable: false, precision: 7));
            AddColumn("dbo.User", "Updated", c => c.DateTimeOffset(precision: 7));
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "Updated");
            DropColumn("dbo.User", "Created");
            DropColumn("dbo.Series", "Updated");
            DropColumn("dbo.Series", "Created");
            DropColumn("dbo.Property", "Updated");
            DropColumn("dbo.Property", "Created");
            DropColumn("dbo.Note", "Updated");
            DropColumn("dbo.Note", "Created");
            DropColumn("dbo.Record", "Updated");
            DropColumn("dbo.Record", "Created");
            DropColumn("dbo.Dataset", "Updated");
            DropColumn("dbo.Dataset", "Created");
        }
    }
}
