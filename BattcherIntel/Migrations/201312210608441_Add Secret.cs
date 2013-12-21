namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSecret : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Missions", "MissionSecret", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Missions", "MissionSecret");
        }
    }
}
