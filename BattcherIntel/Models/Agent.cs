using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class Agent
    {
        public int Id { get; set; }
        [DataType(DataType.EmailAddress)]
        public string AgentAccount { get; set; }
        public DateTime Birthday { get; set; }
        // TODO: What else should we store here?

        // Nav properties
        public virtual IdentityUser User { get; set; }
        public virtual IEnumerable<Mission> Missions { get; set; }
        public virtual IEnumerable<Report> Reports { get; set; }
    }
}