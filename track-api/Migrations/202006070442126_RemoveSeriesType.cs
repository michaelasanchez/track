namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveSeriesType : DbMigration
    {
        public override void Up()
        {
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
            
        }
    }
}
