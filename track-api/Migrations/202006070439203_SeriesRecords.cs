namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeriesRecords : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Record", "Series_Id", c => c.Int());
            CreateIndex("dbo.Record", "Series_Id");
            AddForeignKey("dbo.Record", "Series_Id", "dbo.Series", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Record", "Series_Id", "dbo.Series");
            DropIndex("dbo.Record", new[] { "Series_Id" });
            DropColumn("dbo.Record", "Series_Id");
        }
    }
}
