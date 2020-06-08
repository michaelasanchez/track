using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using track_api.Models.Db;

namespace track_api.Models.Api
{
    public class ApiSeries
    {
        public int Id { get; set; }

        public string Label { get; set; }

        public SeriesType SeriesType { get; set; }

        public string Color { get; set; }

        public int Order { get; set; }

        public List<string> Data { get; set; }

        public ApiSeries(Series series = null)
        {
            if (series != null)
            {
                Id = (int)series?.Id;
                Label = series?.Label;
                SeriesType = (SeriesType)series?.TypeId;
                Color = String.IsNullOrEmpty(series.Color) ? null : $"#{series.Color}";
                Order = (int)series?.Order;

                Data = new List<string>();
            }
        }
    }
}