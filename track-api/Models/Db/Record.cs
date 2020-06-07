namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Record")]
    public partial class Record
    {
        public int Id { get; set; }

        public int DatasetId { get; set; }

        public DateTime DateTime { get; set; }

        public ICollection<Property> Properties { get; set; }

        public ICollection<Note> Notes { get; set; }
    }
}
