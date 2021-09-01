const { ClickHouse } = require('clickhouse');
const { CLICKHOUSE } = require("./config/keys")

const bodyParser = require("./middleware/bodyparser")

const clickhouse = new ClickHouse({
  host: CLICKHOUSE.HOST,
  debug: false,
  basicAuth: null,
  isUseGzip: false,
  format: "json",
  raw: false,
  config: {
    database: CLICKHOUSE.DB,
  }
})



const queries = [

  "CREATE TABLE IF NOT EXISTS json_as_string (json String) ENGINE = MergeTree() ORDER BY json",

];


module.exports = async (req, res) => {

  //
  await bodyParser(req)

  // 
  const { url, method, body } = req;
  console.log({ url, method, body })

  //




  switch (method) {
    case "POST":

      const r = await clickhouse.query(`CREATE TABLE IF NOT EXISTS ${body.table} (json String) ENGINE = MergeTree() ORDER BY json`).toPromise();
      console.log(r);


      const ws = clickhouse.insert(`INSERT INTO ${body.table}(json)`).stream();
      for (const row of body.data) {
        await ws.writeRow(
          [JSON.stringify(row)]
        );
      }
      const result = await ws.exec();
      console.log(result);

      const r2 = await clickhouse.query(`SELECT * FROM ${body.table};`).toPromise();
      console.log(r2);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(r2));
      // res.write(JSON.stringify(payload));
      res.end();
      break;


    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Bad request" }));
      res.end();
      break;
  }

}