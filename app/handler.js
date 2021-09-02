const CacheService = require("./servises/cacheService")

const bodyParser = require("./middleware/bodyparser")



module.exports = async (req, res) => {

  //
  await bodyParser(req)

  // 
  const { method, body } = req;


  switch (method) {
    case "POST":

      Object.keys(body).forEach(key => {
        if (!key) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ error: `JSON is incorrect. Key ${key} required` }));
          res.end();
        }
      })


      await CacheService.cacheData(body)

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(body.data));
      res.end();
      break;


    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Bad request" }));
      res.end();
      break;
  }

}