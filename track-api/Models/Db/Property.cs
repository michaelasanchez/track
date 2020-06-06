namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Property")]
    public partial class Property
    {
        public int Id { get; set; }

        public int RecordId { get; set; }

        public int SeriesId { get; set; }

        [Required]
        [StringLength(50)]
        public string Value { get; set; }
    }
}
