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

        public string OktaUserId { get; set; }

        public string Username { get; set; }

        public ICollection<Dataset> Datasets { get; set; }
    }
}
