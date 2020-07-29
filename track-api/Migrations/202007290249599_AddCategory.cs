namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCategory : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Label = c.String(),
                        Created = c.DateTimeOffset(nullable: false, precision: 7),
                        Updated = c.DateTimeOffset(precision: 7),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Dataset", "CategoryId", c => c.Int());
            CreateIndex("dbo.Dataset", "CategoryId");
            AddForeignKey("dbo.Dataset", "CategoryId", "dbo.Categories", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Dataset", "CategoryId", "dbo.Categories");
            DropIndex("dbo.Dataset", new[] { "CategoryId" });
            DropColumn("dbo.Dataset", "CategoryId");
            DropTable("dbo.Categories");
        }
    }
}
