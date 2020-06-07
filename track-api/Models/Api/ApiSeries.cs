using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace track_api.Models.Api
{
    public class ApiSeries
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public SeriesType SeriesType { get; set; }

        public string Color { get; set; }

        public List<string> Data { get; set; }

        public ApiSeries(Series series, Db.Series testSeries = null)
        {
            if (testSeries != null)
            {
                Id = testSeries.Id;
                Label = testSeries.Label;
                SeriesType = (SeriesType)testSeries.TypeId;
                Color = String.IsNullOrEmpty(testSeries.Color) ? null : $"#{testSeries.Color}";

            }
            else
            {
                Id = series.Id;
                Label = series.Label;
                SeriesType = (SeriesType)series.TypeId;
                Color = String.IsNullOrEmpty(series.Color) ? null : $"#{series.Color}";
            }

            Data = new List<string>();
        }
    }
}