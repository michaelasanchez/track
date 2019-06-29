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

        public Dataset(string label)
        {
            Label = label;

            SeriesList = new List<Series>();
            RecordList = new List<Record>();
        }
        
        public Dataset(string label, List<Series> seriesList)
        {
            Label = label;

            SeriesList = seriesList;
            RecordList = new List<Record>();
        }

        // Add record & update start/end datetimes
        public void addRecord(Record record)
        {
            // Check if first record
            //  Otherwise, check for new start/end datetime
            if (recordCount() == 0)
            {
                startDateTime = record.DateTime;
                endDateTime = record.DateTime;
            } else
            {
                if (record.DateTime.CompareTo(startDateTime) < 0)
                    startDateTime = record.DateTime;
                if (record.DateTime.CompareTo(endDateTime) > 0)
                    endDateTime = record.DateTime;
            }

            RecordList.Add(record);
        }

        // Return number of records currently in dataset
        public int recordCount()
        {
            return RecordList.Count;
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
        
        // 
        public List<DateTime> getDateTimes()
        {
            List<DateTime> dtList = new List<DateTime>();

            foreach (Record n in RecordList)
                dtList.Add(n.DateTime);

            return dtList;
        }

        // 
        public TimeSpan getTimeSpan()
        {
            return new TimeSpan(endDateTime.Ticks - startDateTime.Ticks);
        }

        // 
        public List<Object> getProperty(string prop)
        {
            List<Object>pList = new List<Object>();

            foreach (Record r in RecordList)
            {
                pList.Add(r[prop]);
            }

            return pList;
        }

        // 
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