using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class ReportSubmission
    {
        [Required]
        public int MissionId;
        [Required]
        public string Comments;
    }
}