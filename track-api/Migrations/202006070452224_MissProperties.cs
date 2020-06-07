namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MissProperties : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Dataset", "Private", c => c.Boolean(nullable: false));
            AddColumn("dbo.Series", "Visible", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Series", "Visible");
            DropColumn("dbo.Dataset", "Private");
        }
    }
}
