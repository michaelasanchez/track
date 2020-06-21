namespace track_api.Models.Db
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Series
    {
        public Series()
        {
            Visible = true;
        }

        public int Id { get; set; }

        public int DatasetId { get; set; }

        public int TypeId { get; set; }

        public string Label { get; set; }

        [StringLength(6)]
        public string Color { get; set; }

        public string Unit { get; set; }

        public int Order { get; set; }

        public bool Visible { get; set; }
    }
}
