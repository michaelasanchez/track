namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DatasetUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Dataset", "User_Id", c => c.Int());
            CreateIndex("dbo.Dataset", "User_Id");
            Sql("UPDATE [Dataset] SET [User_Id] = [UserId]");
            AddForeignKey("dbo.Dataset", "User_Id", "dbo.User", "Id");
            DropColumn("dbo.Dataset", "UserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Dataset", "UserId", c => c.Int(nullable: false));
            DropForeignKey("dbo.Dataset", "User_Id", "dbo.User");
            DropIndex("dbo.Dataset", new[] { "User_Id" });
            DropColumn("dbo.Dataset", "User_Id");
        }
    }
}
