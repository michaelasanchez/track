using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track.Models
{
    public partial class Series
    {
        public string Type { get; set; }

        public Series(int id, string label, string type, string color)
        {
            Id = id;
            Label = label;
            Type = type;
            Color = color;
        }
    }
}