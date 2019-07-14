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
using track.ViewModels;

namespace track.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Dictionary<int, string> datasetDict = DatabaseManager.getDatasetLabels();
            
            // Cookie for last viewed dataset id
            HttpCookie lastId = Request.Cookies["lastDatasetId"];

            if (lastId != null)
            {
                ViewData["lastId"] = lastId.Value;
            }

            // Returns List of Label strings
            return View(datasetDict);
        }

        public PartialViewResult ViewDatasetView(int id)
        {
            Dataset dataset = DatabaseManager.getDataset(id);

            // Set cookie
            HttpCookie lastId = new HttpCookie("lastDatasetId");
            lastId.Value = id.ToString();
            lastId.Expires = DateTime.Now.AddYears(10);

            Response.Cookies.Add(lastId);

            return PartialView("Partials/_ViewDataset", new ViewDatasetViewModel(dataset));
        }

        public PartialViewResult CreateDatasetView()
        {
            return PartialView("Partials/_CreateDataset", DatabaseManager.getSeriesTypes());
        }

        public PartialViewResult EditDatasetView(int id)
        {
            return PartialView("Partials/_EditDataset", DatabaseManager.getDataset(id, false));
        }

        public PartialViewResult DatasetOptions()
        {
            return PartialView("Partials/_DatasetOptions", DatabaseManager.getDatasetLabels());
        }

        public JsonResult GetDatasetSeries(int id)
        {
            Dataset cur = DatabaseManager.getDataset(id, false);

            return Json(JsonConvert.SerializeObject(cur.getSeriesLabels()), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateDataset(string datasetLabel, List<string> propLabels, List<int> propTypes)
        {
            // TODO : replace user id
            return Json(DatabaseManager.createDataset(1, datasetLabel, propLabels, propTypes));
        }

        [HttpPost]
        public JsonResult SaveRecord()
        {
            // Store POST values
            int datasetId = Int32.Parse(Request["id"]);
            DateTime dateTime = DateTime.Parse(Request["datetime"]);

            List<string> labels = Request["labels"].Split(',').ToList<string>();
            List<string> values = Request["values"].Split(',').ToList<string>();

            string note = Request["note"];

            DatabaseManager.saveRecord(datasetId, labels, values, dateTime, note);

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