using System;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;
using Microsoft.Owin;
using Okta.AspNet;
using Owin;

[assembly: OwinStartup(typeof(track_api.Startup))]

namespace track_api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Okta
            app.UseOktaWebApi(new OktaWebApiOptions()
            {
                OktaDomain = WebConfigurationManager.AppSettings["OktaOrgDomain"],
            });

            var config = new HttpConfiguration();

            //config.EnableDependencyInjection();
        }
    }
}
