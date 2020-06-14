using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using track_api.Converters;
using track_api.Models;
using track_api.Models.Api;
using track_api.Models.Db;
using track_api.Utils;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApiDatasetsController : ApiController
    {
        private ModelContext db = new ModelContext();

        // GET: api/ApiDatasets
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ApiDatasets/5
        public IHttpActionResult Get(int id)
        {
            // TODO: This always returns null ??
            var user = UserUtils.GetUserFromContext(db, HttpContext.Current);

            var dbDataset = db.Datasets
                .Include("Series")
                .Include("Records.Properties")
                .FirstOrDefault(d => d.Id == id);

            if (dbDataset != null)
            {
                // TODO: This should be set upon dataset create/edit
                var seriesOrder = 0;
                foreach (var series in dbDataset.Series)
                {
                    series.Order = seriesOrder;
                    seriesOrder++;
                }

                return Ok(DatasetConverter.Convert(dbDataset));
            }

            // TODO: Figure out correct response here
            return null;
        }

        // POST: api/ApiDatasets
        //public void Post([FromBody]string value)
        //{
        //}

        // PUT: api/ApiDatasets/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        // DELETE: api/ApiDatasets/5
        //public void Delete(int id)
        //{
        //    var dbDataset = db.Datasets.FirstOrDefault(d => d.Id == id);

        //    if (dbDataset != null)
        //    {
        //        dbDataset.Archived = true;
        //        db.SaveChanges();
        //    }
        //}
    }
}
