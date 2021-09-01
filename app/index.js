
const http = require("http");

const { HTTP_PORT } = require("./config/keys")

const CHouse = require("./classes/CHouse")()
const handler = require("./handler")


CHouse.connect()
  .then((res) => console.log("Connect to clickhouse succesful"))
  .then((res) => {
    http
      .createServer(handler)
      .listen(HTTP_PORT, () => {
        console.log(`Server listening on port ${HTTP_PORT}...`);
      });
  })
  .catch(e => {
    throw new Error(e)
  })
