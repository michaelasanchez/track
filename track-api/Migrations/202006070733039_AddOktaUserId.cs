namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOktaUserId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "OktaUserId", c => c.String());
            AlterColumn("dbo.User", "Username", c => c.String(unicode: false));
            DropColumn("dbo.User", "Password");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "Password", c => c.String(maxLength: 32, unicode: false));
            AlterColumn("dbo.User", "Username", c => c.String(maxLength: 50, unicode: false));
            DropColumn("dbo.User", "OktaUserId");
        }
    }
}
