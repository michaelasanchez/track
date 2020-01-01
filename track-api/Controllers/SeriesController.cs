﻿using System;
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
    public class SeriesController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Series
        [EnableQuery]
        public IQueryable<Series> GetSeries()
        {
            return db.Series;
        }

        // GET: odata/Series(5)
        [EnableQuery]
        public SingleResult<Series> GetSeries([FromODataUri] int key)
        {
            return SingleResult.Create(db.Series.Where(series => series.Id == key));
        }

        // PUT: odata/Series(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Series> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Series series = db.Series.Find(key);
            if (series == null)
            {
                return NotFound();
            }

            patch.Put(series);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(series);
        }

        // POST: odata/Series
        public IHttpActionResult Post(Series series)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Series.Add(series);
            db.SaveChanges();

            return Created(series);
        }

        // PATCH: odata/Series(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Series> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Series series = db.Series.Find(key);
            if (series == null)
            {
                return NotFound();
            }

            patch.Patch(series);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(series);
        }

        // DELETE: odata/Series(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Series series = db.Series.Find(key);
            if (series == null)
            {
                return NotFound();
            }

            db.Series.Remove(series);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Series(5)/Dataset
        [EnableQuery]
        public SingleResult<Dataset> GetDataset([FromODataUri] int key)
        {
            return SingleResult.Create(db.Series.Where(m => m.Id == key).Select(m => m.Dataset));
        }

        // GET: odata/Series(5)/Properties
        [EnableQuery]
        public IQueryable<Property> GetProperties([FromODataUri] int key)
        {
            return db.Series.Where(m => m.Id == key).SelectMany(m => m.Properties);
        }

        // GET: odata/Series(5)/SeriesType
        [EnableQuery]
        public SingleResult<SeriesType> GetSeriesType([FromODataUri] int key)
        {
            return SingleResult.Create(db.Series.Where(m => m.Id == key).Select(m => m.SeriesType));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeriesExists(int key)
        {
            return db.Series.Count(e => e.Id == key) > 0;
        }
    }
}
