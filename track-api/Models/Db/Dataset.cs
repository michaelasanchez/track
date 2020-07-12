namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Dataset")]
    public partial class Dataset : DbEntity
    {
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public bool Archived { get; set; }

        public string Label { get; set; }

        [NotMapped]
        public TimeSpan Span { get; set; }

        public bool Private { get; set; }

        public ICollection<Series> Series { get; set; }

        public ICollection<Record> Records { get; set; }
    }
}
