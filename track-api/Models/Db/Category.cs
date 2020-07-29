using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track_api.Models.Db
{
    public class Category : DbEntity
    {
        public string Label { get; set; }

        public ICollection<Dataset> Datasets { get; set; }

    }
}