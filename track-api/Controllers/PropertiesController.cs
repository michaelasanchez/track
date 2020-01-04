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
    public class PropertiesController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Properties
        [EnableQuery]
        public IQueryable<Property> GetProperties()
        {
            return db.Properties;
        }

        // GET: odata/Properties(5)
        [EnableQuery]
        public SingleResult<Property> GetProperty([FromODataUri] int key)
        {
            return SingleResult.Create(db.Properties.Where(property => property.Id == key));
        }

        // PUT: odata/Properties(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Property> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Property property = db.Properties.Find(key);
            if (property == null)
            {
                return NotFound();
            }

            patch.Put(property);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(property);
        }

        // POST: odata/Properties
        public IHttpActionResult Post(Property property)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Properties.Add(property);
            db.SaveChanges();

            return Created(property);
        }

        // PATCH: odata/Properties(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Property> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Property property = db.Properties.Find(key);
            if (property == null)
            {
                return NotFound();
            }

            patch.Patch(property);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(property);
        }

        // DELETE: odata/Properties(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Property property = db.Properties.Find(key);
            if (property == null)
            {
                return NotFound();
            }

            db.Properties.Remove(property);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Properties(5)/Record
        [EnableQuery]
        public SingleResult<Record> GetRecord([FromODataUri] int key)
        {
            return SingleResult.Create(db.Properties.Where(m => m.Id == key).Select(m => m.Record));
        }

        // GET: odata/Properties(5)/Series
        [EnableQuery]
        public SingleResult<Series> GetSeries([FromODataUri] int key)
        {
            return SingleResult.Create(db.Properties.Where(m => m.Id == key).Select(m => m.Series));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PropertyExists(int key)
        {
            return db.Properties.Count(e => e.Id == key) > 0;
        }
    }
}
