using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track.Models
{
    public class Series
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public string Type { get; set; }

        public string Color { get; set; }

        public Series() { }

        public Series(int id, string label, string type, string color)
        {
            Id = id;
            Label = label;
            Type = type;
            Color = color;
        }
    }
}