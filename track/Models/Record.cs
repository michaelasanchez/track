using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace track.Models
{
    public partial class Record
    {
        public Dictionary<int, object> Properties = new Dictionary<int, object>();

        public string Note { get; set; }


        public Record(DateTime dateTime)
        {
            DateTime = dateTime;
        }

        public Record(DateTime dateTime, string note)
        {
            DateTime = dateTime;
            Note = note;
        }

        public Record(DateTime dateTime, Dictionary<int, object> props)
        {
            DateTime = dateTime;

            foreach (var prop in props)
            {
                Properties[prop.Key] = prop.Value;
            }
        }

        public Record(DateTime dateTime, Dictionary<int, object> props, string note)
        {
            DateTime = dateTime;

            foreach (var prop in props)
            {
                Properties[prop.Key] = prop.Value;
            }

            Note = note;
        }

        public object this[int key]
        {
            get {
                if (Properties.ContainsKey(key))
                {
                    return Properties[key];
                }
                return null;
            }
            set
            {
                Properties[key] = value;
            }
        }

    }
}
