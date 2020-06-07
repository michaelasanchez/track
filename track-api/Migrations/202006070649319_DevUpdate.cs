namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DevUpdate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Dataset", "Private", c => c.Boolean(nullable: false));
            AddColumn("dbo.Dataset", "User_Id", c => c.Int());
            AddColumn("dbo.Series", "Visible", c => c.Boolean(nullable: false));
            Sql("UPDATE [Dataset] SET [User_Id] = [UserId]");
            AlterColumn("dbo.Dataset", "Label", c => c.String(unicode: false));
            AlterColumn("dbo.Note", "Text", c => c.String(nullable: false, unicode: false));
            AlterColumn("dbo.Property", "Value", c => c.String(nullable: false, unicode: false));
            AlterColumn("dbo.Series", "Label", c => c.String(unicode: false));
            AlterColumn("dbo.Series", "Unit", c => c.String(unicode: false));
            CreateIndex("dbo.Dataset", "User_Id");
            CreateIndex("dbo.Record", "DatasetId");
            CreateIndex("dbo.Property", "RecordId");
            CreateIndex("dbo.Series", "DatasetId");
            AddPrimaryKey("dbo.User", "Id");
            AddForeignKey("dbo.Property", "RecordId", "dbo.Record", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Record", "DatasetId", "dbo.Dataset", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Series", "DatasetId", "dbo.Dataset", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Dataset", "User_Id", "dbo.User", "Id");
            DropColumn("dbo.Dataset", "UserId");
            DropTable("dbo.SeriesType");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.SeriesType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50, unicode: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Dataset", "UserId", c => c.Int(nullable: false));
            Sql("UPDATE [Dataset] SET [UserId] = [User_Id]");
            DropPrimaryKey("dbo.User");
            DropForeignKey("dbo.Dataset", "User_Id", "dbo.User");
            DropForeignKey("dbo.Series", "DatasetId", "dbo.Dataset");
            DropForeignKey("dbo.Record", "DatasetId", "dbo.Dataset");
            DropForeignKey("dbo.Property", "RecordId", "dbo.Record");
            DropIndex("dbo.Series", new[] { "DatasetId" });
            DropIndex("dbo.Property", new[] { "RecordId" });
            DropIndex("dbo.Record", new[] { "DatasetId" });
            DropIndex("dbo.Dataset", new[] { "User_Id" });
            AlterColumn("dbo.Series", "Unit", c => c.String(maxLength: 50, unicode: false));
            AlterColumn("dbo.Series", "Label", c => c.String(maxLength: 50, unicode: false));
            AlterColumn("dbo.Property", "Value", c => c.String(nullable: false, maxLength: 50, unicode: false));
            AlterColumn("dbo.Note", "Text", c => c.String(nullable: false, maxLength: 200, unicode: false));
            AlterColumn("dbo.Dataset", "Label", c => c.String(maxLength: 50, unicode: false));
            DropColumn("dbo.Series", "Visible");
            DropColumn("dbo.Dataset", "User_Id");
            DropColumn("dbo.Dataset", "Private");
        }
    }
}
