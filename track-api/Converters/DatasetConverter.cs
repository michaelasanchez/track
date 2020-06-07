using System;
using System.Collections.Generic;
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


            return apiDataset;
        }
    }
}