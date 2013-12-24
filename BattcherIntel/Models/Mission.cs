using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class Mission
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(127)]
        public string MissionCode { get; set; }
        public string MissionText { get; set; }
        [MaxLength(1023)]
        public string MissionSecret { get; set; }
        public DateTime? Unlocked { get; set; }
        public DateTime? Completed { get; set; }
        public bool IsBirthdayMission { get; set; }
        public bool IsArchived { get; set; }

        // Nav properties
        [Required]
        public virtual Agent Agent { get; set; }
        public virtual Agent TargetAgent { get; set; }
        public virtual Pack Pack { get; set; }

        public virtual ICollection<Report> Reports { get; set; }
    }
}