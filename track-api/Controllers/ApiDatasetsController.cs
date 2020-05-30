using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using track_api.Models;
using track_api.Models.Api;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApiDatasetsController : ApiController
    {
        private TrackContext db = new TrackContext();

        // GET: api/ApiDatasets
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ApiDatasets/5
        public IHttpActionResult Get(int id)
        {
            var dbDataset = db.Datasets.FirstOrDefault(d => d.Id == id);

            if (dbDataset == null)
            {
                return null;
            }

            var apiDataset = new ApiDataset(dbDataset);

            return Ok(apiDataset);
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
        //}
    }
}
