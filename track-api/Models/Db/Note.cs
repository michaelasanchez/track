namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Note")]
    public partial class Note
    {
        public int Id { get; set; }

        public int RecordId { get; set; }

        [Required]
        [StringLength(200)]
        public string Text { get; set; }
    }
}
