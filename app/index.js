
const http = require("http");

const { HTTP_PORT } = require("./config/keys")

const CHouse = require("./classes/CHouse")()
const CRedis = require("./classes/CRedis")();

const CacheService = require("./servises/cacheService")
CacheService.watcher()

const handler = require("./handler")

CHouse.connect()
      .then(() => CRedis.connect())
      .then(() => http
                    .createServer(handler)
                    .listen(HTTP_PORT, () => {
                      console.log(`Server listening on port ${HTTP_PORT}...`);
                    })
      )
      .catch(e => {
        throw new Error(e)
      })



