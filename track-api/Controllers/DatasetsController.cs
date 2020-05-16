using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using track_api.Models;
using System.Web.Http.Cors;
using System.Web.Http;
using System.Web;
using track_api.Utils;

namespace track_api.Controllers
{
    //[Authorize]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DatasetsController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Datasets
        //[Authorize]
        [EnableQuery]
        public IQueryable<Dataset> GetDatasets()
        {
            var user = UserUtils.GetUser(db, HttpContext.Current);

            if (user == null)
            {
                return db.Datasets.Where(z => z.Private == false);
            }
            else
            {
                return db.Datasets.Where(z => z.Private == false || z.UserId == user.Id);
            }
        }

        // GET: odata/Datasets(5)
        [EnableQuery]
        public Dataset GetDataset([FromODataUri] int key)
        {
            var query = db.Datasets.Where(dataset => dataset.Id == key);

            // Calculate timespan property
            // TODO: Figure out where this goes
            foreach (var ds in query)
            {
                var records = db.Records.Where(r => r.DatasetId == key);
                ds.Span = records.Any() ? records.Max(r => r.DateTime) - records.Min(r => r.DateTime) : new TimeSpan();
            }

            var result = query.Single();
            result.Records = result.Records.OrderBy(r => r.DateTime).ToList();

            return result;
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
        //[Authorize]
        public IHttpActionResult Post(Dataset dataset)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = UserUtils.GetUser(db, HttpContext.Current);
            if (user != null)
            {
                dataset.UserId = user.Id;
            }

            db.Datasets.Add(dataset);

            try
            {
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                while (ex.InnerException != null) ex = ex.InnerException;
                return BadRequest(ex.Message);
            }

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

            dataset.Archived = true;

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
