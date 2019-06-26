using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace track.Models
{

    public class Dataset
    {
        public string Id { get; set; }
        public string Label { get; set; }

        private List<Record> RecordList;

        private List<Series> SeriesList;

        private List<int> SeriesIdList = new List<int>();
        private List<string> SeriesLabelList = new List<string>();
        private List<string> SeriesTypeList = new List<string>();
        private List<string> SeriesColorList;

        private DateTime startDateTime { get; set; }
        private DateTime endDateTime { get; set; }

        
        public Dataset(string label, List<int> seriesIds, List<string> seriesLabel, List<string> seriesTypes, List<string> seriesColors = null)
        {
            Label = label;

            SeriesIdList = seriesIds;
            SeriesLabelList = seriesLabel;
            SeriesTypeList = seriesTypes;
            SeriesColorList = seriesColors;

            SeriesList = new List<Series>();
            RecordList = new List<Record>();
        }

        public Dataset(string label, List<Series> seriesList)
        {
            Label = label;

            SeriesList = seriesList;
            RecordList = new List<Record>();
        }

        public void createRecord(DateTime dateTime, Dictionary<string, object> props, string note = null)
        {
            // Init start & end
            if (startDateTime.CompareTo(new DateTime()) == 0)
            {
                startDateTime = dateTime;
                endDateTime = dateTime;
            }
            
            // Test for new start or end
            if (dateTime.CompareTo(startDateTime) < 0)
                startDateTime = dateTime;
            if (dateTime.CompareTo(endDateTime) > 0)
                endDateTime = dateTime;

            // Create record & add properties
            Record temp;
            if (note != null)
                temp = new Record(dateTime, note);
            else
                temp = new Record(dateTime);

            foreach (var p in props)
            {
                temp[p.Key] = p.Value;
            }
            RecordList.Add(temp);
        }

        public int recordCount()
        {
            return RecordList.Count;
        }

        public void addSeries(string seriesLabel)
        { 
            // TODO : test for duplicates
            SeriesLabelList.Add(seriesLabel);
        }

        // Add series to dataset
        public void addSeries(Series series)
        {
            SeriesList.Add(series);
        }

        // Return list of series ids
        public List<int> getSeriesIds()
        {
            return SeriesList.Select(x => x.Id).ToList();
        }

        // Return list of series labels
        public List<string> getSeriesLabels()
        {
            return SeriesList.Select(x => x.Label).ToList();
        }

        // Return list of series types
        public List<string> getSeriesTypes()
        {
            return SeriesList.Select(x => x.Type).ToList();
        }

        // Return list of series colors
        public List<string> getSeriesColors()
        {
            return SeriesList.Select(x => x.Color).ToList();
        }
        
        public List<DateTime> getDateTimes()
        {
            List<DateTime> dtList = new List<DateTime>();

            foreach (Record n in RecordList)
                dtList.Add(n.DateTime);

            return dtList;
        }

        public TimeSpan getTimeSpan()
        {
            return new TimeSpan(endDateTime.Ticks - startDateTime.Ticks);
        }

        public List<Object> getProperty(string prop)
        {
            List<Object>pList = new List<Object>();

            foreach (Record r in RecordList)
            {
                pList.Add(r[prop]);
            }

            return pList;
        }

        public List<string> getNotes()
        {
            List<string> noteList = new List<string>();

            foreach (Record r in RecordList)
            {
                noteList.Add(r.Note);
            }

            return noteList;
        }
    }
}