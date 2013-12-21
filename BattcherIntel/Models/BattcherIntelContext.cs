using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class BattcherIntelContext : IdentityDbContext
    {
        public DbSet<Agent> Agents { get; set; }
        public DbSet<Mission> Missions { get; set; }
        public DbSet<Report> Reports { get; set; }
    }
}