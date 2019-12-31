﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using track_api.Models;


namespace track_api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            //
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Dataset>("Datasets");
            builder.EntitySet<User>("Users");
            builder.EntitySet<Record>("Records");
            builder.EntitySet<Series>("Series");
            builder.EntitySet<SeriesType>("SeriesTypes");
            builder.EntitySet<Property>("Properties");
            builder.EntitySet<Note>("Notes");
            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
