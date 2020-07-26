using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using track_api.Models.Api;
using track_api.Models.Db;

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
            ODataModelBuilder builder = new ODataConventionModelBuilder();

            builder.EntitySet<Dataset>("Datasets");
            builder.EntitySet<User>("Users");
            builder.EntitySet<Record>("Records");
            builder.EntitySet<Location>("Locations");
            builder.EntitySet<Series>("Series");
            builder.EntitySet<Property>("Properties");
            builder.EntitySet<Note>("Notes");

            builder.EntitySet<ApiDataset>("ApiDatasets");
            builder.EntitySet<ApiSeries>("ApiSeries");

            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
