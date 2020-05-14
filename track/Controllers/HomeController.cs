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
            // TODO? This will break the old front end
            return PartialView("Partials/_CreateDataset", db/*.SeriesTypes.ToList()*/);
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

    }
}