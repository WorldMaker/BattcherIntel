namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Onemorespotofcleanup : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Missions", "AgentId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Missions", "AgentId", c => c.Int());
        }
    }
}
