using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace track_api.Models
{
    interface IDatedEntity
    {
        DateTimeOffset Created { get; set; }
        DateTimeOffset? Updated { get; set; }
    }
}
