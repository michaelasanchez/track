using System;
using System.Collections.Generic;
using System.Linq;
using track_api.Models.Api;
using track_api.Models.Db;

namespace track_api.Converters
{
    public static class DatasetConverter
    {
        private static TimeZoneInfo easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");

        public static ApiDataset Convert(Dataset dataset)
        {
            var apiDataset = new ApiDataset();

            apiDataset.Id = dataset.Id;
            apiDataset.Label = dataset.Label;

            var span = dataset.Records.Any() ? dataset.Records.Max(r => r.DateTime) - dataset.Records.Min(r => r.DateTime) : new TimeSpan();
            apiDataset.Span = span;
            apiDataset.Ticks = span.Ticks;

            // TODO: These should be called record ids/labels
            apiDataset.SeriesIds = new List<int>();
            apiDataset.SeriesLabels = new List<DateTime>();

            var series = new List<ApiSeries>();
            foreach (Series s in dataset.Series.Where(s => s.Visible))
            {
                series.Add(new ApiSeries(s));
            }

            int recordCount = 0;
            foreach (Record record in dataset.Records.OrderBy(r => r.DateTime))
            {
                recordCount++;
                apiDataset.SeriesIds.Add(record.Id);
                apiDataset.SeriesLabels.Add(TimeZoneInfo.ConvertTimeFromUtc(record.DateTime, easternTimeZone));

                foreach (Property prop in record.Properties)
                {
                    var propSeries = series.FirstOrDefault(s => s.Id == prop.SeriesId);

                    if (propSeries != null)
                        propSeries.Data.Add(prop.Value);

                    if (propSeries.SeriesType != SeriesType.Boolean)
                    {
                        if (string.IsNullOrEmpty(propSeries.Min) || decimal.Parse(propSeries.Min) > decimal.Parse(prop.Value))
                        {
                            propSeries.Min = prop.Value;
                        }

                        if (string.IsNullOrEmpty(propSeries.Max) || decimal.Parse(propSeries.Max) < decimal.Parse(prop.Value))
                        {
                            propSeries.Max = prop.Value;
                        }
                    }
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