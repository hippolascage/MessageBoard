using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http;

namespace MessageBoard
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            var jsonFormatter = configuration.Formatters.OfType<JsonMediaTypeFormatter>().First();

            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            configuration.Routes.MapHttpRoute(
                name: "RepliesApi",
                routeTemplate: "api/v1/topics/{topicid}/replies/{id}",
                defaults: new { controller = "replies", id = RouteParameter.Optional });

            configuration.Routes.MapHttpRoute(
                name: "TopicsApi", 
                routeTemplate: "api/v1/topics/{id}",
                defaults: new { controller = "topics",  id = RouteParameter.Optional });
        }
    }
}