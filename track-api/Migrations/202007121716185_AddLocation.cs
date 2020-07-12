namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLocation : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Location",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Latitude = c.Double(nullable: false),
                        Longitude = c.Double(nullable: false),
                        Accuracy = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Record", "Location_Id", c => c.Int());
            CreateIndex("dbo.Record", "Location_Id");
            AddForeignKey("dbo.Record", "Location_Id", "dbo.Location", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Record", "Location_Id", "dbo.Location");
            DropIndex("dbo.Record", new[] { "Location_Id" });
            DropColumn("dbo.Record", "Location_Id");
            DropTable("dbo.Location");
        }
    }
}
