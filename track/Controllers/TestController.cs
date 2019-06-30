using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using track.Utils;

namespace track.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public void Index()
        {
            var start = DateTime.Now;

            for (int i = 0; i < 100; i++)
            {
                var test = DatabaseManager.getDataset(43);
            }

            var end = DateTime.Now;


            Debug.WriteLine(end.Ticks - start.Ticks);
        }
    }
}