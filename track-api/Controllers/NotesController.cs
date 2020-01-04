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
    public class NotesController : ODataController
    {
        private TrackContext db = new TrackContext();

        // GET: odata/Notes
        [EnableQuery]
        public IQueryable<Note> GetNotes()
        {
            return db.Notes;
        }

        // GET: odata/Notes(5)
        [EnableQuery]
        public SingleResult<Note> GetNote([FromODataUri] int key)
        {
            return SingleResult.Create(db.Notes.Where(note => note.Id == key));
        }

        // PUT: odata/Notes(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Note> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Note note = db.Notes.Find(key);
            if (note == null)
            {
                return NotFound();
            }

            patch.Put(note);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(note);
        }

        // POST: odata/Notes
        public IHttpActionResult Post(Note note)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Notes.Add(note);
            db.SaveChanges();

            return Created(note);
        }

        // PATCH: odata/Notes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Note> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Note note = db.Notes.Find(key);
            if (note == null)
            {
                return NotFound();
            }

            patch.Patch(note);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(note);
        }

        // DELETE: odata/Notes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Note note = db.Notes.Find(key);
            if (note == null)
            {
                return NotFound();
            }

            db.Notes.Remove(note);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Notes(5)/Record
        [EnableQuery]
        public SingleResult<Record> GetRecord([FromODataUri] int key)
        {
            return SingleResult.Create(db.Notes.Where(m => m.Id == key).Select(m => m.Record));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool NoteExists(int key)
        {
            return db.Notes.Count(e => e.Id == key) > 0;
        }
    }
}
