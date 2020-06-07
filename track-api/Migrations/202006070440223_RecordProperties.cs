namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RecordProperties : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Property", "RecordId");
            AddForeignKey("dbo.Property", "RecordId", "dbo.Record", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Property", "RecordId", "dbo.Record");
            DropIndex("dbo.Property", new[] { "RecordId" });
        }
    }
}
