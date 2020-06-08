namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Dataset",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Archived = c.Boolean(nullable: false),
                        Label = c.String(unicode: false),
                        Private = c.Boolean(nullable: false),
                        User_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.User", t => t.User_Id)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.Record",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DatasetId = c.Int(nullable: false),
                        DateTime = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Dataset", t => t.DatasetId, cascadeDelete: true)
                .Index(t => t.DatasetId);
            
            CreateTable(
                "dbo.Note",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RecordId = c.Int(nullable: false),
                        Text = c.String(nullable: false, unicode: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Record", t => t.RecordId, cascadeDelete: true)
                .Index(t => t.RecordId);
            
            CreateTable(
                "dbo.Property",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RecordId = c.Int(nullable: false),
                        SeriesId = c.Int(nullable: false),
                        Value = c.String(nullable: false, unicode: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Record", t => t.RecordId, cascadeDelete: true)
                .Index(t => t.RecordId);
            
            CreateTable(
                "dbo.Series",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DatasetId = c.Int(nullable: false),
                        TypeId = c.Int(nullable: false),
                        Label = c.String(unicode: false),
                        Color = c.String(maxLength: 6, fixedLength: true, unicode: false),
                        Unit = c.String(unicode: false),
                        Visible = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Dataset", t => t.DatasetId, cascadeDelete: true)
                .Index(t => t.DatasetId);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OktaUserId = c.String(),
                        Username = c.String(unicode: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Dataset", "User_Id", "dbo.User");
            DropForeignKey("dbo.Series", "DatasetId", "dbo.Dataset");
            DropForeignKey("dbo.Record", "DatasetId", "dbo.Dataset");
            DropForeignKey("dbo.Property", "RecordId", "dbo.Record");
            DropForeignKey("dbo.Note", "RecordId", "dbo.Record");
            DropIndex("dbo.Series", new[] { "DatasetId" });
            DropIndex("dbo.Property", new[] { "RecordId" });
            DropIndex("dbo.Note", new[] { "RecordId" });
            DropIndex("dbo.Record", new[] { "DatasetId" });
            DropIndex("dbo.Dataset", new[] { "User_Id" });
            DropTable("dbo.User");
            DropTable("dbo.Series");
            DropTable("dbo.Property");
            DropTable("dbo.Note");
            DropTable("dbo.Record");
            DropTable("dbo.Dataset");
        }
    }
}
