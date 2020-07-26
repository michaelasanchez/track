using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using track_api.Models.Db;
using track_api.Utils;

namespace track_api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        private ModelContext db = new ModelContext();

        // GET: api/Users
        [Route("api/User")]
        public User Get()
        {
            return UserUtils.GetUser(db, HttpContext.Current);
        }

        // GET: api/Users/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Users
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Users/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Users/5
        public void Delete(int id)
        {
        }
    }
}
