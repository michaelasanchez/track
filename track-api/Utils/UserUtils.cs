using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using track_api.Models;

namespace track_api.Utils
{
    public static class UserUtils
    {
        public static User GetUser(TrackContext context, HttpContext httpContext)
        {
            var userClaims = httpContext.GetOwinContext().Authentication.User.Claims;

            if (userClaims.Any())
            {
                var clientId = userClaims.FirstOrDefault(z => z.Type == "cid").Value;
                var userId = userClaims.FirstOrDefault(z => z.Type == "uid")?.Value;

                return context.Users.FirstOrDefault(z => z.OktaUserId == userId);
            }

            return null;
        }
    }
}