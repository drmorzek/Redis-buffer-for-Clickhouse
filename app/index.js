
const http = require("http");

const { HTTP_PORT } = require("./config/keys")

const CHouse = require("./classes/CHouse")()
const CRedis = require("./classes/CRedis")();

const handler = require("./handler")

const redis = CRedis.redis

setInterval(() => {
    
    redis.get("_tables_stats").then( res => {
      const stats = JSON.parse(res)
      if(!stats) return
      let newstats = {}
      Object.entries(stats).forEach(([table, json]) => {

        if( json.buffer >= json.max_buffer || json.time <= 0 ) {
          redis.get(table).then(async data => {
            let array = JSON.parse(data)
            if( array != null) {
              
              console.log("Insert to clickhouse", {
                table, json
              })
              await CHouse.insertData(table, array)
            }
            redis.del(table)
            delete newstats[table];
          })
        }

        json.time = json.time - 1
        newstats[table] = json

      })

      redis.set("_tables_stats", JSON.stringify(newstats))
      
    } )

  }, 1000)


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



