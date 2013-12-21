using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public enum ReportType : int
    {
        Other = 0,
        Completion = 1,
        Interception = 2,
    }

    public class Report
    {
        public int Id { get; set; }
        [Required]
        public ReportType Type { get; set; }
        public DateTime Created { get; set; }
        public string Comments { get; set; }

        // Nav properties
        [Required]
        public virtual Agent Agent { get; set; }
        [Required]
        public virtual Mission Mission { get; set; }
    }
}