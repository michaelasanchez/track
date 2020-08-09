using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track_api.Models.Api
{
    public class ApiDataset
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public TimeSpan Span { get; set; }

        public long Ticks { get; set; }

        public List<int> SeriesIds { get; set; }
        public List<DateTime> SeriesLabels { get; set; }

        public List<ApiSeries> NumericalSeries { get; set; }
        public List<ApiSeries> FrequencySeries { get; set; }
    }
}