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

        public List<DateTime> SeriesLabels { get; set; }

        public List<ApiSeries> NumericalSeries { get; set; }
        public List<ApiSeries> FrequencySeries { get; set; }

        public ApiDataset(Dataset dataset)
        {
            Id = dataset.Id;
            Label = dataset.Label;

            Span = dataset.Records.Any() ? dataset.Records.Max(r => r.DateTime) - dataset.Records.Min(r => r.DateTime) : new TimeSpan();

            SeriesLabels = new List<DateTime>();

            var series = new List<ApiSeries>();
            foreach (Series s in dataset.Series)
            {
                series.Add(new ApiSeries(s));
            }

            int recordCount = 0;
            foreach (Record record in dataset.Records)
            {
                recordCount++;
                SeriesLabels.Add(record.DateTime);

                foreach (Property prop in record.Properties)
                {
                    var propSeries = series.FirstOrDefault(s => s.Id == prop.SeriesId);
                    propSeries.Data.Add(prop.Value);
                }

                foreach (ApiSeries s in series)
                {
                    if (s.Data.Count < recordCount)
                    {
                        s.Data.Add(null);
                    }
                }
            }

            NumericalSeries = series.Where(s => s.SeriesType != SeriesType.Boolean).ToList();
            FrequencySeries = series.Where(s => s.SeriesType == SeriesType.Boolean).ToList();
        }
    }
}