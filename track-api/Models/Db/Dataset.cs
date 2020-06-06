namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Dataset")]
    public partial class Dataset
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public bool Archived { get; set; }

        [StringLength(50)]
        public string Label { get; set; }
    }
}
