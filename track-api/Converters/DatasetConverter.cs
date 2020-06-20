using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using track_api.Models.Api;
using track_api.Models.Db;

namespace track_api.Converters
{
    public static class DatasetConverter
    {
        public static ApiDataset Convert(Dataset dataset)
        {
            var apiDataset = new ApiDataset();

            apiDataset.Id = dataset.Id;
            apiDataset.Label = dataset.Label;

            var span = dataset.Records.Any() ? dataset.Records.Max(r => r.DateTime) - dataset.Records.Min(r => r.DateTime) : new TimeSpan();
            apiDataset.Span = span;
            apiDataset.Ticks = span.Ticks;

            apiDataset.SeriesLabels = new List<DateTime>();

            var series = new List<ApiSeries>();
            foreach (Series s in dataset.Series.Where(s => s.Visible))
            {
                series.Add(new ApiSeries(s));
            }

            // TODO: Result of adding constraints to prod db
            //  Keeping this in until confirmed not happening
            int mismatchCount = 0;

            int recordCount = 0;
            foreach (Record record in dataset.Records.OrderBy(r => r.DateTime))
            {
                recordCount++;
                apiDataset.SeriesLabels.Add(record.DateTime);

                foreach (Property prop in record.Properties)
                {
                    var propSeries = series.FirstOrDefault(s => s.Id == prop.SeriesId);

                    if (propSeries != null)
                        propSeries.Data.Add(prop.Value);
                    else
                        mismatchCount++;
                }

                foreach (ApiSeries s in series)
                {
                    if (s.Data.Count < recordCount)
                    {
                        s.Data.Add(null);
                    }
                }
            }

            apiDataset.NumericalSeries = series.Where(s => s.SeriesType != SeriesType.Boolean).ToList();
            apiDataset.FrequencySeries = series.Where(s => s.SeriesType == SeriesType.Boolean).ToList();

            return apiDataset;
        }
    }
}