namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DatasetSeries : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Series", "DatasetId");
            AddForeignKey("dbo.Series", "DatasetId", "dbo.Dataset", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Series", "DatasetId", "dbo.Dataset");
            DropIndex("dbo.Series", new[] { "DatasetId" });
        }
    }
}
