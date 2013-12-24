using BattcherIntel.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace BattcherIntel.Controllers
{
    [Authorize(Roles="Agent")]
    public class DashboardController : ApiController
    {
        private BattcherIntelContext db = new BattcherIntelContext();
        private UserManager<IdentityUser> uman;

        public DashboardController()
        {
            uman = new UserManager<IdentityUser>(new UserStore<IdentityUser>(this.db));
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetDashboard()
        {
            var dbuser = await uman.FindByIdAsync(User.Identity.GetUserId());
            var agent = await db.Agents.Where(a => a.User.Id == dbuser.Id).SingleOrDefaultAsync();
            var isBirthday = DateTime.Today.Month == agent.Birthday.Month && DateTime.Today.Day == agent.Birthday.Day;
            var missions = await db.Missions.Where(m => m.Agent.Id == agent.Id && m.Unlocked.HasValue && !m.Completed.HasValue).ToArrayAsync();
            var reports = await db.Reports.Where(r => r.Mission.Completed.HasValue && r.Agent.User.Id != dbuser.Id
                    && (r.Mission.Agent.User.Id == dbuser.Id || r.Mission.TargetAgent.User.Id == dbuser.Id))
                .OrderByDescending(r => r.Created)
                .Select(r => new { report = r, missionCode = r.Mission.MissionCode })
                .Take(15)
                .ToArrayAsync();
            var unlockable = (int)Math.Floor((DateTime.Today - new DateTime(2013, 12, 25)).TotalDays / 7) + 1;
            return Ok(new { available = unlockable - missions.Length, isBirthday, missions, reports });
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
