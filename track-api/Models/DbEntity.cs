using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track_api.Models
{
    public class DbEntity : IDatedEntity
    {
        public int Id { get; set; }

        public DateTimeOffset Created { get; set; }
        public DateTimeOffset? Updated { get; set; }
    }
}