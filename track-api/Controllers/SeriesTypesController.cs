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
    public class SeriesTypesController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/SeriesTypes
        [EnableQuery]
        public IQueryable<SeriesType> GetSeriesTypes()
        {
            return db.SeriesTypes.Where(seriesType => !seriesType.Inactive);
        }

        // GET: odata/SeriesTypes(5)
        [EnableQuery]
        public SingleResult<SeriesType> GetSeriesType([FromODataUri] int key)
        {
            return SingleResult.Create(db.SeriesTypes.Where(seriesType => seriesType.Id == key));
        }

        // PUT: odata/SeriesTypes(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<SeriesType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SeriesType seriesType = db.SeriesTypes.Find(key);
            if (seriesType == null)
            {
                return NotFound();
            }

            patch.Put(seriesType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(seriesType);
        }

        // POST: odata/SeriesTypes
        public IHttpActionResult Post(SeriesType seriesType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SeriesTypes.Add(seriesType);
            db.SaveChanges();

            return Created(seriesType);
        }

        // PATCH: odata/SeriesTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<SeriesType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SeriesType seriesType = db.SeriesTypes.Find(key);
            if (seriesType == null)
            {
                return NotFound();
            }

            patch.Patch(seriesType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(seriesType);
        }

        // DELETE: odata/SeriesTypes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            SeriesType seriesType = db.SeriesTypes.Find(key);
            if (seriesType == null)
            {
                return NotFound();
            }

            db.SeriesTypes.Remove(seriesType);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/SeriesTypes(5)/Series
        [EnableQuery]
        public IQueryable<Series> GetSeries([FromODataUri] int key)
        {
            return db.SeriesTypes.Where(m => m.Id == key).SelectMany(m => m.Series);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeriesTypeExists(int key)
        {
            return db.SeriesTypes.Count(e => e.Id == key) > 0;
        }
    }
}
