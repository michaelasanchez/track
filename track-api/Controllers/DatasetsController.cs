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
using Z.EntityFramework.Plus;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DatasetsController : ODataController
    {
        private ModelContext db = new ModelContext();

        private User user;

        public DatasetsController()
        {
            user = UserUtils.GetUserFromContext(db, HttpContext.Current);
        }

        // GET: odata/Datasets
        [EnableQuery]
        public IQueryable<Dataset> GetDatasets()
        {
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
            IQueryable<Dataset> dbDataset;
            if (user == null)
            {
                dbDataset = db.Datasets.Where(dataset => dataset.Id == key && dataset.Private == false);
            }
            else
            {
                dbDataset = db.Datasets.Where(dataset => dataset.Id == key && (dataset.UserId == user.Id || dataset.Private == false));
            }

            //dbDataset = dbDataset.IncludeFilter(d => d.Series.Where(s => s.Visible));

            //return dbDataset.First();
            return SingleResult.Create(dbDataset);
        }

        // PUT: odata/Datasets(5)
        [EnableQuery]
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

            if (user != null)
            {
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

            if (user == null)
            {
                // TODO: Return a bad request instead
                dataset.Private = false;
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
