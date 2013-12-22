namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsArchivedflag : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Missions", "IsArchived", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Missions", "IsArchived");
        }
    }
}
