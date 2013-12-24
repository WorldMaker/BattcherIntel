using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BattcherIntel.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace BattcherIntel.Controllers
{
    [Authorize(Roles="Agent")]
    public class ReportController : ApiController
    {
        private BattcherIntelContext db = new BattcherIntelContext();
        private UserManager<IdentityUser> uman;

        public ReportController()
        {
            uman = new UserManager<IdentityUser>(new UserStore<IdentityUser>(this.db));
        }

        // GET api/Report
        public IQueryable<Report> GetReports()
        {
            return db.Reports;
        }

        // GET api/Report/5
        [ResponseType(typeof(Report))]
        public async Task<IHttpActionResult> GetReport(int id)
        {
            Report report = await db.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            return Ok(report);
        }

        // PUT api/Report/5
        [Authorize(Roles="Admin")]
        public async Task<IHttpActionResult> PutReport(int id, Report report)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != report.Id)
            {
                return BadRequest();
            }

            db.Entry(report).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Report
        [ResponseType(typeof(Report))]
        public async Task<IHttpActionResult> PostReport(ReportSubmission submission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbuser = await uman.FindByIdAsync(User.Identity.GetUserId());
            var mission = await db.Missions.FindAsync(submission.MissionId);

            if (mission == null || !(mission.IsArchived || mission.Agent.User.Id == dbuser.Id))
            {
                return BadRequest("Inaccessible mission.");
            }

            var report = new Report
            {
                Mission = mission,
                Agent = await db.Agents.Where(a => a.User.Id == dbuser.Id).SingleAsync(),
                Type = ReportType.Other,
                Comments = submission.Comments,
                Created = DateTime.UtcNow,
            };

            db.Reports.Add(report);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = report.Id }, report);
        }

        // DELETE api/Report/5
        [Authorize(Roles="Admin")]
        [ResponseType(typeof(Report))]
        public async Task<IHttpActionResult> DeleteReport(int id)
        {
            Report report = await db.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            db.Reports.Remove(report);
            await db.SaveChangesAsync();

            return Ok(report);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ReportExists(int id)
        {
            return db.Reports.Any(e => e.Id == id);
        }
    }
}