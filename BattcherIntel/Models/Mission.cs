using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class Mission
    {
        public int MissionId { get; set; }
        [Required]
        public string MissionCode { get; set; }
        [Required]
        public int AgentId { get; set; }
        public string MissionText { get; set; }
        public string MissionSecret { get; set; }
        public int? TargetAgentId { get; set; }
        public DateTime? Unlocked { get; set; }
        public DateTime? Completed { get; set; }
        public bool IsBirthdayMission { get; set; }

        // Nav properties
        public virtual Agent Agent { get; set; }
        public virtual Agent TargetAgent { get; set; }
        public virtual IEnumerable<Report> Reports { get; set; }
    }
}