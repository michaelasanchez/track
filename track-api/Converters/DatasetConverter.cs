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

            apiDataset.Span = dataset.Records.Any() ? dataset.Records.Max(r => r.DateTime) - dataset.Records.Min(r => r.DateTime) : new TimeSpan();

            apiDataset.SeriesLabels = new List<DateTime>();

            var series = new List<ApiSeries>();
            foreach (Series s in dataset.Series)
            {
                series.Add(new ApiSeries(null, s));
            }

            int recordCount = 0;
            var mismatchCount = 0;
            foreach (Record record in dataset.Records)
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

            Debug.WriteLine($"{dataset.Label} has ({mismatchCount}) mismatched records");

            apiDataset.NumericalSeries = series.Where(s => s.SeriesType != SeriesType.Boolean).ToList();
            apiDataset.FrequencySeries = series.Where(s => s.SeriesType == SeriesType.Boolean).ToList();

            return apiDataset;
        }
    }
}