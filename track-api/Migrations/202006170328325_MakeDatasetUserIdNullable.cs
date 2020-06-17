namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MakeDatasetUserIdNullable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Dataset", "UserId", "dbo.User");
            DropIndex("dbo.Dataset", new[] { "UserId" });
            AlterColumn("dbo.Dataset", "UserId", c => c.Int());
            CreateIndex("dbo.Dataset", "UserId");
            AddForeignKey("dbo.Dataset", "UserId", "dbo.User", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Dataset", "UserId", "dbo.User");
            DropIndex("dbo.Dataset", new[] { "UserId" });
            AlterColumn("dbo.Dataset", "UserId", c => c.Int(nullable: false));
            CreateIndex("dbo.Dataset", "UserId");
            AddForeignKey("dbo.Dataset", "UserId", "dbo.User", "Id", cascadeDelete: true);
        }
    }
}
