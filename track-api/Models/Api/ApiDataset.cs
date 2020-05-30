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

        public List<ApiSeries> Series { get; set; }

        //public List<ApiSeries> NumericalSeries { get; set; }
        //public List<ApiSeries> FrequencySeries { get; set; }

        public ApiDataset(Dataset dataset)
        {
            Id = dataset.Id;
            Label = dataset.Label;
            Series = new List<ApiSeries>();

            //NumericalSeries = new List<ApiSeries>();
            //FrequencySeries = new List<ApiSeries>();

            foreach (Series series in dataset.Series)
            {
                Series.Add(new ApiSeries(series));
                //if (series.TypeId == (int)SeriesType.Boolean)
                //    FrequencySeries.Add(new ApiSeries(series));
                //else
                //    NumericalSeries.Add(new ApiSeries(series));
            }

            int recordCount = 0;

            foreach (Record record in dataset.Records)
            {
                recordCount++;

                foreach (Property prop in record.Properties)
                {
                    var series = Series.FirstOrDefault(s => s.Id == prop.SeriesId);
                    series.Data.Add(prop.Value);
                }

                foreach (ApiSeries series in Series)
                {
                    if (series.Data.Count < recordCount)
                    {
                        series.Data.Add(null);
                    }
                }
            }
        }
    }
}