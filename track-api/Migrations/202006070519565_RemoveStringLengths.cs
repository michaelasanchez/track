namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveStringLengths : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Dataset", "Span", c => c.Time(nullable: false, precision: 7));
            AlterColumn("dbo.Dataset", "Label", c => c.String(unicode: false));
            AlterColumn("dbo.Series", "Label", c => c.String(unicode: false));
            AlterColumn("dbo.Series", "Unit", c => c.String(unicode: false));
            AlterColumn("dbo.Note", "Text", c => c.String(nullable: false, unicode: false));
            AlterColumn("dbo.Property", "Value", c => c.String(nullable: false, unicode: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Property", "Value", c => c.String(nullable: false, maxLength: 50, unicode: false));
            AlterColumn("dbo.Note", "Text", c => c.String(nullable: false, maxLength: 200, unicode: false));
            AlterColumn("dbo.Series", "Unit", c => c.String(maxLength: 50, unicode: false));
            AlterColumn("dbo.Series", "Label", c => c.String(maxLength: 50, unicode: false));
            AlterColumn("dbo.Dataset", "Label", c => c.String(maxLength: 50, unicode: false));
            DropColumn("dbo.Dataset", "Span");
        }
    }
}
