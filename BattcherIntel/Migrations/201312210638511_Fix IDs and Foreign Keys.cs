namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FixIDsandForeignKeys : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Missions", "Agent_AgentId", "dbo.Agents");
            DropForeignKey("dbo.Missions", "TargetAgent_AgentId", "dbo.Agents");
            DropForeignKey("dbo.Reports", "AgentId", "dbo.Agents");
            DropForeignKey("dbo.Reports", "MissionId", "dbo.Missions");
            DropIndex("dbo.Missions", new[] { "Agent_AgentId" });
            DropIndex("dbo.Missions", new[] { "TargetAgent_AgentId" });
            DropIndex("dbo.Reports", new[] { "AgentId" });
            DropIndex("dbo.Reports", new[] { "MissionId" });
            RenameColumn(table: "dbo.Missions", name: "MissionId", newName: "Id");
            RenameColumn(table: "dbo.Agents", name: "AgentId", newName: "Id");
            RenameColumn(table: "dbo.Reports", name: "ReportId", newName: "Id");
            RenameColumn(table: "dbo.Missions", name: "Agent_AgentId", newName: "Agent_Id");
            RenameColumn(table: "dbo.Missions", name: "TargetAgent_AgentId", newName: "TargetAgent_Id");
            RenameColumn(table: "dbo.Reports", name: "AgentId", newName: "Agent_Id");
            RenameColumn(table: "dbo.Reports", name: "MissionId", newName: "Mission_Id");
            CreateIndex("dbo.Missions", "Agent_Id");
            CreateIndex("dbo.Missions", "TargetAgent_Id");
            CreateIndex("dbo.Reports", "Agent_Id");
            CreateIndex("dbo.Reports", "Mission_Id");
            AddForeignKey("dbo.Missions", "Agent_Id", "dbo.Agents", "Id");
            AddForeignKey("dbo.Missions", "TargetAgent_Id", "dbo.Agents", "Id");
            AddForeignKey("dbo.Reports", "Agent_Id", "dbo.Agents", "Id");
            AddForeignKey("dbo.Reports", "Mission_Id", "dbo.Missions", "Id", cascadeDelete: true);
            DropColumn("dbo.Missions", "TargetAgentId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Missions", "TargetAgentId", c => c.Int());
            DropForeignKey("dbo.Reports", "Mission_Id", "dbo.Missions");
            DropForeignKey("dbo.Reports", "Agent_Id", "dbo.Agents");
            DropForeignKey("dbo.Missions", "TargetAgent_Id", "dbo.Agents");
            DropForeignKey("dbo.Missions", "Agent_Id", "dbo.Agents");
            DropIndex("dbo.Reports", new[] { "Mission_Id" });
            DropIndex("dbo.Reports", new[] { "Agent_Id" });
            DropIndex("dbo.Missions", new[] { "TargetAgent_Id" });
            DropIndex("dbo.Missions", new[] { "Agent_Id" });
            RenameColumn("dbo.Missions", "Id", "MissionId");
            RenameColumn("dbo.Agents", "Id", "AgentId");
            RenameColumn("dbo.Reports", "Id", "ReportId");
            RenameColumn(table: "dbo.Reports", name: "Mission_Id", newName: "MissionId");
            RenameColumn(table: "dbo.Reports", name: "Agent_Id", newName: "AgentId");
            RenameColumn(table: "dbo.Missions", name: "TargetAgent_Id", newName: "TargetAgent_AgentId");
            RenameColumn(table: "dbo.Missions", name: "Agent_Id", newName: "Agent_AgentId");
            CreateIndex("dbo.Reports", "MissionId");
            CreateIndex("dbo.Reports", "AgentId");
            CreateIndex("dbo.Missions", "TargetAgent_AgentId");
            CreateIndex("dbo.Missions", "Agent_AgentId");
            AddForeignKey("dbo.Reports", "MissionId", "dbo.Missions", "MissionId", cascadeDelete: true);
            AddForeignKey("dbo.Reports", "AgentId", "dbo.Agents", "AgentId", cascadeDelete: true);
            AddForeignKey("dbo.Missions", "TargetAgent_AgentId", "dbo.Agents", "AgentId");
            AddForeignKey("dbo.Missions", "Agent_AgentId", "dbo.Agents", "AgentId");
        }
    }
}
