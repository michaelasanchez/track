﻿using Newtonsoft.Json;
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

        public PartialViewResult CreateDatasetView()
        {
            return PartialView("Partials/_CreateDataset", new CreateDatasetViewModel());
        }

        public PartialViewResult EditDatasetView(int id)
        {
            return PartialView("Partials/_EditDataset", DatabaseManager.getDataset(id, false));
        }

        public PartialViewResult DatasetOptions()
        {
            return PartialView("Partials/_DatasetOptions", DatabaseManager.getDatasetLabels());
        }

        public JsonResult GetDataset(int id, bool loadData = true)
        {
            // Set cookie
            HttpCookie lastId = new HttpCookie("lastDatasetId");
            lastId.Value = id.ToString();
            lastId.Expires = DateTime.Now.AddYears(10);

            Response.Cookies.Add(lastId);

            return Json(new DatasetViewModel(DatabaseManager.getDataset(id, loadData)), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDatasetSeries(int id)
        {
            Dataset cur = DatabaseManager.getDataset(id);

            return Json(JsonConvert.SerializeObject(cur.getSeriesLabels()), JsonRequestBehavior.AllowGet);
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