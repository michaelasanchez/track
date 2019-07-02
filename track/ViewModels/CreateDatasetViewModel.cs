using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using track.Utils;

namespace track.ViewModels
{
    public class CreateDatasetViewModel
    {
        public Dictionary<int, string> SeriesTypes = DatabaseManager.getSeriesTypes();
    }
}