using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using track.Models;

namespace track.ViewModels
{
    public class DatasetViewModel
    {
        // Internal
        private Dataset _Dataset;

        // Serializable properties
        public int id;
        public string label;

        public List<Series> series;

        public List<string> records;

        public Dictionary<string, object> properties = new Dictionary<string, object>();

        public List<string> notes;

        public string span;

        public DatasetViewModel(Dataset dataset)
        {
            _Dataset = dataset;

            // 
            id = _Dataset.Id;
            label = _Dataset.Label;

            series = _Dataset.getSeries();

            records = _Dataset.getDateTimes().Select(dt => dt.ToString()).ToList();

            foreach (var s in series)
            {
                properties.Add(s.Label, _Dataset.getProperty(s.Id));
            }

            notes = _Dataset.getNotes();

            span = _Dataset.getTimeSpan().ToString();
        }
    }
}