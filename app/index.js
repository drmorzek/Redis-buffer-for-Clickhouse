
const http = require("http");

const {HTTP_PORT} = require("./config/keys")

const handler = require("./handler")

http
  .createServer(handler)
  .listen(HTTP_PORT, () => {
    console.log(`Server listening on port ${HTTP_PORT}...`);
  });