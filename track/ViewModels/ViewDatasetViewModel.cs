using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using track.Models;

namespace track.ViewModels
{
    public class ViewDatasetViewModel
    {
        // Serializable properties
        public int id;
        public string label;

        public List<Series> series;

        public List<String> records;

        public List<DateTime> test;

        public Dictionary<string, object> properties = new Dictionary<string, object>();

        public List<string> notes;

        public string span;

        public ViewDatasetViewModel(Dataset dataset)
        {
            id = dataset.Id;
            label = dataset.Label;

            series = dataset.getSeries();

            records = dataset.getDateTimes().Select(dt => dt.ToString()).ToList();
            test = dataset.getDateTimes();

            foreach (var s in series)
            {
                properties.Add(s.Label, dataset.getProperty(s.Id));
            }

            notes = dataset.getNotes();

            span = dataset.getTimeSpan().ToString();
        }
    }
}