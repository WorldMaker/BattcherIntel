namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgentBirthday : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Agents", "Birthday", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Agents", "Birthday");
        }
    }
}
