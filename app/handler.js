const CHouse = require("./classes/CHouse")()
const redis = require("./classes/CRedis")().redis
const bodyParser = require("./middleware/bodyparser")


module.exports = async (req, res) => {

  //
  await bodyParser(req)

  // 
  const { url, method, body } = req;
  console.log({ body })


  switch (method) {
    case "POST":

      const { table, max_buffer, max_time, data} = body
      
      let table_data = await redis.get(table)
      table_data = table_data == null ? [] : JSON.parse(table_data)      
      table_data = [...table_data, ...data]
      


      let table_limits = await redis.get("_tables_stats")
      table_limits = table_limits == null ? {} : JSON.parse(table_limits)
      table_limits[table] = {
        max_buffer, max_time,
        buffer: Buffer.from(JSON.stringify(table_data)).length,
        time: max_time
      }

      // const r = await CHouse.insertData(body.table, body.data)      
      // console.log(r);
      // console.log(table_limits);
      // console.log(table_data)

      // const r2 = await CHouse.getData(body.table)
      redis.set("_tables_stats", JSON.stringify(table_limits))
      redis.set(table, JSON.stringify(table_data))

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data));
      res.end();
      break;


    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Bad request" }));
      res.end();
      break;
  }

}