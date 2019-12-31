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
using track.Models;
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
            // TODO : replace user id
            return Json(DatabaseManager.createDataset(1, datasetLabel, propLabels, propTypes));
        }

        [HttpPost]
        public JsonResult CreateRecord(int datasetId, DateTime dateTime, List<string> labels, List<string> values, string note)
        {
            DatabaseManager.createRecord(datasetId, labels, values, dateTime, note);

            return Json(true);
        }

        [HttpPost]
        public JsonResult UpdateDataset(int datasetId,
                                        string datasetLabel = null,
                                        List<int> propIds = null,
                                        List<string> propLabels = null,
                                        List<string> propColors = null)
        {
            if (datasetLabel != null) DatabaseManager.updateDataset(datasetId, datasetLabel);

            if (propIds != null)
            {
                for (int i = 0; i < propIds.Count; i++)
                {
                    DatabaseManager.updateSeries(propIds[i], propLabels[i], propColors[i]);
                }
            }

            return Json(datasetId);
        }

    }
}