﻿using BattcherIntel.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace BattcherIntel.Controllers
{
    [Authorize(Roles="Agent")]
    public class MissionController : ApiController
    {
        private BattcherIntelContext db = new BattcherIntelContext();
        private UserManager<IdentityUser> uman;

        public MissionController()
        {
            uman = new UserManager<IdentityUser>(new UserStore<IdentityUser>(this.db));
        }

        // GET api/Mission
        public IQueryable GetMissions()
        {
            return db.Missions
                .Where(m => m.IsArchived)
                .Select(m => new
                {
                    Agent = new { Username = m.Agent.User.UserName },
                    m.Completed,
                    m.Id,
                    m.IsArchived,
                    m.MissionCode,
		    m.MissionText,
                    m.Pack,
                    TargetAgent = new { Username = m.TargetAgent.User.UserName },
                    m.Unlocked,
                })
                .OrderByDescending(m => m.Completed);
        }

        // GET api/Mission/5
        [ResponseType(typeof(Mission))]
        public async Task<IHttpActionResult> GetMissionByCode(string code)
        {
            var dbuser = await uman.FindByIdAsync(User.Identity.GetUserId());
            Mission mission = await db.Missions.Include(m => m.Reports)
                .Where(m => m.MissionCode == code)
                .SingleOrDefaultAsync();
            if (mission == null || !mission.Unlocked.HasValue || (!mission.IsArchived && mission.Agent.User.Id != dbuser.Id))
            {
                return NotFound();
            }

            return Ok(mission);
        }

        // PUT api/Mission/5
        [Authorize(Roles="Admin")]
        public async Task<IHttpActionResult> PutMission(int id, Mission mission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mission.Id)
            {
                return BadRequest();
            }

            db.Entry(mission).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MissionExists(id))
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

        // POST api/Mission
        [Authorize(Roles="Admin")]
        [ResponseType(typeof(Mission))]
        public async Task<IHttpActionResult> PostMission(Mission mission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Missions.Add(mission);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = mission.Id }, mission);
        }

        // DELETE api/Mission/5
        [Authorize(Roles="Admin")]
        [ResponseType(typeof(Mission))]
        public async Task<IHttpActionResult> DeleteMission(int id)
        {
            Mission mission = await db.Missions.FindAsync(id);
            if (mission == null)
            {
                return NotFound();
            }

            db.Missions.Remove(mission);
            await db.SaveChangesAsync();

            return Ok(mission);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MissionExists(int id)
        {
            return db.Missions.Any(m => m.Id == id);
        }
    }
}