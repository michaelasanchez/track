namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RecordNote : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Note", "RecordId");
            AddForeignKey("dbo.Note", "RecordId", "dbo.Record", "Id", cascadeDelete: true);
            DropColumn("dbo.Record", "Note");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Record", "Note", c => c.String(maxLength: 100, unicode: false));
            DropForeignKey("dbo.Note", "RecordId", "dbo.Record");
            DropIndex("dbo.Note", new[] { "RecordId" });
        }
    }
}
