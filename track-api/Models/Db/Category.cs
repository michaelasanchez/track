using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace track_api.Models.Db
{
    [Table("Category")]
    public class Category : DbEntity
    {
        public string Label { get; set; }

        public virtual ICollection<Dataset> Datasets { get; set; }

    }
}