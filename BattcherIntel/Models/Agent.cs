using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        [JsonIgnore]
        public virtual IdentityUser User { get; set; }

        [JsonIgnore]
        [InverseProperty("Agent")]
        public virtual ICollection<Mission> Missions { get; set; }

        [JsonIgnore]
        [InverseProperty("TargetAgent")]
        public virtual ICollection<Mission> TargettedMissions { get; set; }

        [JsonIgnore]
        public virtual ICollection<Report> Reports { get; set; }

        [NotMapped]
        public string Username
        {
            get { return User == null ? "[Redacted]" : User.UserName; }
        }
    }
}