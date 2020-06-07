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

        public User User { get; set; }

        public bool Archived { get; set; }

        public string Label { get; set; }

        [NotMapped]
        public TimeSpan Span { get; set; }

        public bool Private { get; set; }

        public ICollection<Series> Series { get; set; }

        public ICollection<Record> Records { get; set; }
    }
}
