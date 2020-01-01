using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using track_api.Models;
using System.Web.Http.Cors;


namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DatasetsController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Datasets
        [EnableQuery]
        public IQueryable<Dataset> GetDatasets()
        {
            return db.Datasets;
        }

        // GET: odata/Datasets(5)
        [EnableQuery]
        public SingleResult<Dataset> GetDataset([FromODataUri] int key)
        {
            var query = db.Datasets.Where(dataset => dataset.Id == key);

            // Calculate timespan property
            // TODO: Figure out where this goes
            foreach (var ds in query)
            {
                var records = db.Records.Where(r => r.DatasetId == key);
                ds.Span = records.Any() ? records.Max(r => r.DateTime) - records.Min(r => r.DateTime) : new TimeSpan();
            }

            return SingleResult.Create(query);
        }

        // PUT: odata/Datasets(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Dataset> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Dataset dataset = db.Datasets.Find(key);
            if (dataset == null)
            {
                return NotFound();
            }

            patch.Put(dataset);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DatasetExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(dataset);
        }

        // POST: odata/Datasets
        public IHttpActionResult Post(Dataset dataset)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Datasets.Add(dataset);
            db.SaveChanges();

            return Created(dataset);
        }

        // PATCH: odata/Datasets(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Dataset> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Dataset dataset = db.Datasets.Find(key);
            if (dataset == null)
            {
                return NotFound();
            }

            patch.Patch(dataset);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DatasetExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(dataset);
        }

        // DELETE: odata/Datasets(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Dataset dataset = db.Datasets.Find(key);
            if (dataset == null)
            {
                return NotFound();
            }

            db.Datasets.Remove(dataset);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Datasets(5)/User
        [EnableQuery]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.Datasets.Where(m => m.Id == key).Select(m => m.User));
        }

        // GET: odata/Datasets(5)/Records
        [EnableQuery]
        public IQueryable<Record> GetRecords([FromODataUri] int key)
        {
            return db.Datasets.Where(m => m.Id == key).SelectMany(m => m.Records);
        }

        // GET: odata/Datasets(5)/Series
        [EnableQuery]
        public IQueryable<Series> GetSeries([FromODataUri] int key)
        {
            return db.Datasets.Where(m => m.Id == key).SelectMany(m => m.Series);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DatasetExists(int key)
        {
            return db.Datasets.Count(e => e.Id == key) > 0;
        }
    }
}
