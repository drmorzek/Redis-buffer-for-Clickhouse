const CacheService = require("./servises/cacheService")

const bodyParser = require("./middleware/bodyparser")



module.exports = async (req, res) => {

  //
  await bodyParser(req)

  // 
  const { method, body } = req;


  switch (method) {
    case "POST":
      const need_fields = ["table", "data", "max_buffer", "max_time"]
        .filter(item => Object.keys(body).indexOf(item) < 0)

      if (need_fields.length !== 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ error: `JSON is incorrect. Key ${need_fields.join(",")} required` }));
        res.end();
        return
      }

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