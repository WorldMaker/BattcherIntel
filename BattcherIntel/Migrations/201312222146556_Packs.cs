namespace BattcherIntel.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Packs : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Packs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 50),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Missions", "Pack_Id", c => c.Int());
            CreateIndex("dbo.Missions", "Pack_Id");
            AddForeignKey("dbo.Missions", "Pack_Id", "dbo.Packs", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Missions", "Pack_Id", "dbo.Packs");
            DropIndex("dbo.Missions", new[] { "Pack_Id" });
            DropColumn("dbo.Missions", "Pack_Id");
            DropTable("dbo.Packs");
        }
    }
}
