using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using track_api.Models.Db;
using track_api.Utils;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DatasetsController : ODataController
    {
        private ModelContext db = new ModelContext();

        // GET: odata/Datasets
        [EnableQuery]
        public IQueryable<Dataset> GetDatasets()
        {
            var user = UserUtils.GetUserFromContext(db, HttpContext.Current);

            var tests = db.Datasets.ToList();

            if (user == null)
            {
                return db.Datasets.Where(z => z.Private == false);
            }
            else
            {
                return db.Datasets.Where(z => z.UserId == user.Id || z.Private == false);
            }
        }

        // GET: odata/Datasets(5)
        [EnableQuery]
        public SingleResult<Dataset> GetDataset([FromODataUri] int key)
        {
            var user = UserUtils.GetUserFromContext(db, HttpContext.Current);

            IQueryable<Dataset> dbDataset;
            if (user == null)
            {
                dbDataset = db.Datasets.Where(dataset => dataset.Id == key && dataset.Private == false);
            }
            else
            {
                dbDataset = db.Datasets.Where(dataset => dataset.Id == key && dataset.UserId == user.Id);
            }

            return SingleResult.Create(dbDataset);
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
        [EnableQuery]
        public IHttpActionResult Post(Dataset dataset)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = UserUtils.GetUserFromContext(db, HttpContext.Current);
            if (user != null)
            {
                //dataset.User.Id = user.Id;
                dataset.User = new User
                {
                    Id = user.Id
                };
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

            db.SaveChanges();

            return Created(dataset);
        }

        // PATCH: odata/Datasets(5)
        [EnableQuery]
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

        // GET: odata/Datasets(5)/User
        [EnableQuery]
        public SingleResult<User> GetUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.Datasets.Where(m => m.Id == key).Select(m => m.User));
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
