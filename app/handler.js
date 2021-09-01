const { ClickHouse } = require('clickhouse');
const {CLICKHOUSE} = require("./config/keys")

const bodyParser = require("./middleware/bodyparser")

const clickhouse = new ClickHouse({
  url: CLICKHOUSE.HOST,
  debug: false,
  basicAuth: null,
  isUseGzip: false,
  format: "json",
  raw: false,
  
})

module.exports = async (req, res) => {

    //
    const r = await clickhouse.query("SELECT 1, now()").toPromise();
    console.log(r);

    //
    await bodyParser(req)

    // 
    const { url, method, body } = req;
    console.log({ url, method, body })

    switch (method) {
      case "POST":

        const payload = {
          address: {
            street: "123 amazing street",
            city: "Fun City"
          }
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(payload));
        res.end();
        break;
        

      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({error: "Bad request"}));
        res.end();
        break;
    }

  }