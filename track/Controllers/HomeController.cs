using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using track.Utils;
using track_api.Controllers;
using track_api.Models;

namespace track.Controllers
{
    public class HomeController : Controller
    {
        TrackContext db = new TrackContext();

        public ActionResult Index()
        {
            // Cookie for last viewed dataset id
            ViewData["lastId"] = Request.Cookies["lastDatasetId"]?.Value;
            
            return View();
        }

        public PartialViewResult CreateDatasetView()
        {
            return PartialView("Partials/_CreateDataset", db.SeriesTypes.ToList());
        }

        public PartialViewResult EditDatasetView(int id)
        {
            return PartialView("Partials/_EditDataset", db.Datasets.Single(ds => ds.Id == id));
        }

        public PartialViewResult DatasetOptions()
        {
            // Cookie for last viewed dataset id
            ViewData["lastId"] = Request.Cookies["lastDatasetId"]?.Value;

            return PartialView("Partials/_DatasetOptions");
        }

        [HttpPost]
        public JsonResult CreateDataset(string datasetLabel, List<string> propLabels, List<int> propTypes)
        {
            TrackContext db = new TrackContext();
            var datasets = db.Set<Dataset>();

            // Dataset
            datasets.Add(new Dataset
            {
                UserId = 1,
                Label = datasetLabel
            });
            db.SaveChanges();

            // Series
            var datasetId = db.Datasets.Single(ds => ds.Label == datasetLabel).Id;

            var series = db.Set<Series>();
            
            for (var s = 0; s < propLabels.Count; s++)
            {
                series.Add(new Series
                {
                    DatasetId = datasetId,
                    TypeId = propTypes[s],
                    Label = propLabels[s]
                });
            }
            db.SaveChanges();

            return Json(datasetId);
        }

        [HttpPost]
        public JsonResult CreateRecord(int datasetId, DateTime dateTime, List<string> labels, List<string> values, string note)
        {
            TrackContext db = new TrackContext();

            // Record
            var records = db.Set<Record>();
            var newRecord = new Record
            {
                DatasetId = datasetId,
                DateTime = dateTime,
            };

            records.Add(newRecord);
            db.SaveChanges();

            // Note
            var notes = db.Set<Note>();
            notes.Add(new Note
            {
                RecordId = newRecord.Id,
                Text = note
            });
            db.SaveChanges();

            // Properties
            var properties = db.Set<Property>();

            var series = db.Series.Where(s => s.DatasetId == datasetId).ToList();

            for (var p = 0; p < labels.Count; p++)
            {
                properties.Add(new Property
                {
                    RecordId = newRecord.Id,
                    SeriesId = series.Single(s => s.Label == labels[p]).Id,
                    Value = values[p]
                });
            }
            db.SaveChanges();

            return Json(newRecord.Id);
        }

        [HttpPost]
        public JsonResult UpdateDataset(int datasetId, string datasetLabel = null, List<int> propIds = null, List<string> propLabels = null, List<string> propColors = null)
        {
            TrackContext db = new TrackContext();

            // Dataset
            var dataset = db.Datasets.Single(ds => ds.Id == datasetId);

            if (!String.IsNullOrEmpty(datasetLabel)) dataset.Label = datasetLabel;

            db.SaveChanges();

            // Series
            var series = db.Series.Where(s => s.DatasetId == datasetId);

            var test = series.ToList();

            if (propIds != null)
            {
                for (var i = 0; i < propIds.Count; i++)
                {
                    var current = test.Single(s => s.Id == propIds[i]);
                    if (propLabels[i] != null) current.Label = propLabels[i];
                    if (propColors[i] != null) current.Color = propColors[i];
                }
            }
            db.SaveChanges();

            return Json(datasetId);
        }

    }
}