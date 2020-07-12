﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace track_api.Models.Db
{
    [Table("Location")]
    public class Location
    {
        public int Id { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public int Accuracy { get; set; }
    }
}