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
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using BattcherIntel.Models;

namespace BattcherIntel.Controllers
{
    [Authorize]
    public class MissionController : ODataController
    {
        private BattcherIntelContext db = new BattcherIntelContext();

        // GET odata/Mission
        [Queryable]
        public IQueryable<Mission> GetMission()
        {
            return db.Missions;
        }

        // GET odata/Mission(5)
        [Queryable]
        public SingleResult<Mission> GetMission([FromODataUri] int key)
        {
            return SingleResult.Create(db.Missions.Where(mission => mission.MissionId == key));
        }

        // PUT odata/Mission(5)
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Mission mission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != mission.MissionId)
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
                if (!MissionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(mission);
        }

        // POST odata/Mission
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> Post(Mission mission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Missions.Add(mission);
            await db.SaveChangesAsync();

            return Created(mission);
        }

        // PATCH odata/Mission(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [Authorize(Roles = "Admin")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Mission> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mission mission = await db.Missions.FindAsync(key);
            if (mission == null)
            {
                return NotFound();
            }

            patch.Patch(mission);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MissionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(mission);
        }

        // DELETE odata/Mission(5)
        [Authorize(Roles="Admin")]
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Mission mission = await db.Missions.FindAsync(key);
            if (mission == null)
            {
                return NotFound();
            }

            db.Missions.Remove(mission);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/Mission(5)/Agent
        [Queryable]
        public SingleResult<Agent> GetAgent([FromODataUri] int key)
        {
            return SingleResult.Create(db.Missions.Where(m => m.MissionId == key).Select(m => m.Agent));
        }

        // GET odata/Mission(5)/Reports
        [Queryable]
        public IQueryable<Report> GetReports([FromODataUri] int key)
        {
            return db.Missions.Where(m => m.MissionId == key).SelectMany(m => m.Reports);
        }

        // GET odata/Mission(5)/TargetAgent
        [Queryable]
        public SingleResult<Agent> GetTargetAgent([FromODataUri] int key)
        {
            return SingleResult.Create(db.Missions.Where(m => m.MissionId == key).Select(m => m.TargetAgent));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MissionExists(int key)
        {
            return db.Missions.Count(e => e.MissionId == key) > 0;
        }
    }
}
