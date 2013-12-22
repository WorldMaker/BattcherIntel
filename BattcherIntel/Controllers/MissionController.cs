using BattcherIntel.Models;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BattcherIntel.Controllers
{
    [BreezeController]
    [Authorize(Roles="Agent")]
    public class MissionController : ApiController
    {
        readonly EFContextProvider<BattcherIntelContext> _contextProvider = new EFContextProvider<BattcherIntelContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<Mission> MyMissions()
        {
            return _contextProvider.Context.Missions.Where(m => m.Agent.User == User && m.Unlocked.HasValue);
        }

        [HttpGet]
        public IQueryable<Mission> ArchivedMissions()
        {
            return _contextProvider.Context.Missions.Where(m => m.IsArchived);
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }
    }
}
