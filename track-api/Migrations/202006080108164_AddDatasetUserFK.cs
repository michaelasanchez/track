namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddDatasetUserFK : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Dataset", "User_Id", "dbo.User");
            DropIndex("dbo.Dataset", new[] { "User_Id" });
            RenameColumn(table: "dbo.Dataset", name: "User_Id", newName: "UserId");
            AlterColumn("dbo.Dataset", "UserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Dataset", "UserId");
            AddForeignKey("dbo.Dataset", "UserId", "dbo.User", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Dataset", "UserId", "dbo.User");
            DropIndex("dbo.Dataset", new[] { "UserId" });
            AlterColumn("dbo.Dataset", "UserId", c => c.Int());
            RenameColumn(table: "dbo.Dataset", name: "UserId", newName: "User_Id");
            CreateIndex("dbo.Dataset", "User_Id");
            AddForeignKey("dbo.Dataset", "User_Id", "dbo.User", "Id");
        }
    }
}
