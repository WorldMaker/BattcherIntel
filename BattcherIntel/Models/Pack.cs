using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BattcherIntel.Models
{
    public class Pack
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        // Nav properties
        [JsonIgnore]
        public virtual IEnumerable<Mission> Missions { get; set; }
    }
}