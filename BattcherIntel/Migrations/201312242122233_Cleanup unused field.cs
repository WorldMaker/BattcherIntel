namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Cleanupunusedfield : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Missions", "IsBirthdayMission");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Missions", "IsBirthdayMission", c => c.Boolean(nullable: false));
        }
    }
}
