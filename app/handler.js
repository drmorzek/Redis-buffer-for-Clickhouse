const CHouse = require("./classes/CHouse")()

const bodyParser = require("./middleware/bodyparser")


module.exports = async (req, res) => {

  //
  await bodyParser(req)

  // 
  const { url, method, body } = req;
  console.log({ url, method, body })


  switch (method) {
    case "POST":

      const r = await CHouse.insertData(body.table, body.data)      
      console.log(r);

      const r2 = await CHouse.getData(body.table)
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