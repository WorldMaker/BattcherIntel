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
    public class StatsController : ApiController
    {
        private BattcherIntelContext db = new BattcherIntelContext();
        private UserManager<IdentityUser> uman;

        public StatsController()
        {
            uman = new UserManager<IdentityUser>(new UserStore<IdentityUser>(this.db));
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetStats()
        {
            var unlockable = (int)Math.Floor((DateTime.Today - new DateTime(2013, 12, 25)).TotalDays / 7) + 1;
            return Ok(new
            {
                week = unlockable,
                agents = await (from agent in db.Agents
                                let missionCompletionTime = agent.Missions.Where(m => m.Completed.HasValue).Select(m => DbFunctions.DiffSeconds(m.Completed.Value, m.Unlocked.Value))
                                orderby agent.Birthday
                                select new
                                {
                                    UserId = agent.User.Id,
                                    Username = agent.User.UserName,
                                    Completed = agent.Missions.Where(m => m.Completed.HasValue).Count(),
                                    Unlocked = agent.Missions.Where(m => m.Unlocked.HasValue).Count(),
                                    SecretsCompleted = agent.Reports.Where(r => r.Type == ReportType.Completion).Count(),
                                    SecretsIntercepted = agent.Reports.Where(r => r.Type == ReportType.Interception).Count(),
                                    Slowest = missionCompletionTime.Max(),
                                    Fastest = missionCompletionTime.Min(),
                                }).ToArrayAsync(),
            });
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
