using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using track_api.Models;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RecordsController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Records
        [EnableQuery]
        public IQueryable<Record> GetRecords()
        {
            return db.Records;
        }

        // GET: odata/Records(5)
        [EnableQuery]
        public SingleResult<Record> GetRecord([FromODataUri] int key)
        {
            return SingleResult.Create(db.Records.Where(record => record.Id == key));
        }

        // PUT: odata/Records(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Record> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Record record = db.Records.Find(key);
            if (record == null)
            {
                return NotFound();
            }

            patch.Put(record);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecordExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(record);
        }

        // POST: odata/Records
        public IHttpActionResult Post(Record record)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Records.Add(record);
            db.SaveChanges();

            return Created(record);
        }

        // PATCH: odata/Records(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Record> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Record record = db.Records.Find(key);
            if (record == null)
            {
                return NotFound();
            }

            patch.Patch(record);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecordExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(record);
        }

        // DELETE: odata/Records(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Record record = db.Records.Find(key);
            if (record == null)
            {
                return NotFound();
            }

            db.Records.Remove(record);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Records(5)/Dataset
        [EnableQuery]
        public SingleResult<Dataset> GetDataset([FromODataUri] int key)
        {
            return SingleResult.Create(db.Records.Where(m => m.Id == key).Select(m => m.Dataset));
        }

        // GET: odata/Records(5)/Notes
        [EnableQuery]
        public IQueryable<Note> GetNotes([FromODataUri] int key)
        {
            return db.Records.Where(m => m.Id == key).SelectMany(m => m.Notes);
        }

        // GET: odata/Records(5)/Properties
        [EnableQuery]
        public IQueryable<Property> GetProperties([FromODataUri] int key)
        {
            return db.Records.Where(m => m.Id == key).SelectMany(m => m.Properties);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RecordExists(int key)
        {
            return db.Records.Count(e => e.Id == key) > 0;
        }
    }
}
