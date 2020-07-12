namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Property")]
    public partial class Property : DbEntity
    {
        public int RecordId { get; set; }

        public int SeriesId { get; set; }

        [Required]
        public string Value { get; set; }
    }
}
