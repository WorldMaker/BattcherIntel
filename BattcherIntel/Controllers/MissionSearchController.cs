using BattcherIntel.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;

namespace BattcherIntel.Controllers
{
    [Authorize(Roles="Agent")]
    public class MissionSearchController : ApiController
    {
        private static Regex codeRegex = new Regex(@"\w+\d+", RegexOptions.Compiled);
        private static Regex secretRegex = new Regex(@"\w+ \w+ \w+ \w+ \w+\.", RegexOptions.Compiled);
        private BattcherIntelContext db = new BattcherIntelContext();
        private UserManager<IdentityUser> uman;

        public MissionSearchController()
        {
            uman = new UserManager<IdentityUser>(new UserStore<IdentityUser>(this.db));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Search(string query)
        {
            query = query.Trim();
            var dbuser = await uman.FindByIdAsync(User.Identity.GetUserId());
            if (codeRegex.IsMatch(query))
            {
                var mission = await db.Missions.Include(m => m.Pack).Where(m => m.MissionCode == query).SingleOrDefaultAsync();
                if (!mission.Unlocked.HasValue && mission.Agent.User.Id == dbuser.Id && await VerifyUnlock(mission))
                {
                    return Ok(mission);
                }
                else if (!mission.IsArchived && mission.Agent.User.Id == dbuser.Id)
                {
                    return Ok(mission);
                }
                else if (mission.Unlocked.HasValue && mission.IsArchived)
                {
                    return Ok(mission);
                }
                return NotFound();
            }
            else if (secretRegex.IsMatch(query))
            {
                var mission = await db.Missions.Where(m => m.MissionSecret == query).SingleOrDefaultAsync();
                if (mission.Unlocked.HasValue)
                {
                    if (!mission.Completed.HasValue && mission.Agent.User.Id != dbuser.Id)
                    {
                        mission.IsArchived = true;
                        var report = new Report
                        {
                            Agent = await db.Agents.Where(a => a.User.Id == dbuser.Id).FirstAsync(),
                            Created = DateTime.UtcNow,
                            Mission = mission,
                        };
                        if (mission.TargetAgent == null || mission.TargetAgent.User.Id == dbuser.Id)
                        {
                            mission.Completed = DateTime.UtcNow;
                            report.Comments = string.Format(Properties.Resources.MissionCompleted, dbuser.UserName);
                            report.Type = ReportType.Completion;
                        }
                        else
                        {
                            report.Comments = string.Format(Properties.Resources.MissionIntercepted, dbuser.UserName);
                            report.Type = ReportType.Interception;
                        }
                        db.Reports.Add(report);
                        await db.SaveChangesAsync();
                    }
                    return Ok(mission);
                }
                return NotFound();
            }
            else
            {
                return this.NotFound();
            }
        }

        private async Task<bool> VerifyUnlock(Mission mission)
        {
            Contract.Requires(mission.Pack != null);

            var dbuser = await uman.FindByIdAsync(User.Identity.GetUserId());

            switch (mission.Pack.Name)
            {
                case "base2014":
                    var unlockable = (int)Math.Floor((DateTime.Today - new DateTime(2013, 12, 25)).TotalDays / 7) + 1;
                    var missions = await db.Missions.Where(m => m.Unlocked.HasValue && m.Agent.User.Id == dbuser.Id && m.Pack.Name == "base2014").CountAsync();
                    if (missions < unlockable)
                    {
                        return true;
                    }
                    return false;
                case "bday2014":
                    var agent = await db.Agents.Where(a => a.User.Id == dbuser.Id).SingleAsync();
                    var year = agent.Birthday.Month == 12 ? 2013 : 2014;
                    if (DateTime.Today == new DateTime(year, agent.Birthday.Month, agent.Birthday.Day))
                    {
                        return true;
                    }
                    return false;
                default:
                    return false;
            }
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
