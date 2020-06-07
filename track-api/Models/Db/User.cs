namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("User")]
    public partial class User
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Username { get; set; }

        [StringLength(32)]
        public string Password { get; set; }

        public ICollection<Dataset> Datasets { get; set; }
    }
}
