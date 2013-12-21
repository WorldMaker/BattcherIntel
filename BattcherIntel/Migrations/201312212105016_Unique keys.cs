namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Uniquekeys : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Missions", "MissionCode", c => c.String(nullable: false, maxLength: 127));
            AlterColumn("dbo.Missions", "MissionSecret", c => c.String(maxLength: 1023));
            CreateIndex("dbo.Missions", "MissionCode", name: "UX_MissionCode", unique: true);
            CreateIndex("dbo.Missions", "MissionSecret", name: "UX_MissionSecret", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.Missions", "UX_MissionSecret");
            DropIndex("dbo.Missions", "UX_MissionCode");
            AlterColumn("dbo.Missions", "MissionSecret", c => c.String());
            AlterColumn("dbo.Missions", "MissionCode", c => c.String(nullable: false));
        }
    }
}
