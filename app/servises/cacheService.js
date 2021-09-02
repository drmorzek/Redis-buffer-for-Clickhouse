const CHouse = require("../classes/CHouse")()
const { redis } = require("../classes/CRedis")()


module.exports = class CacheService {

    static watcher() {
        setInterval(async () => {
            const res = await redis.get("_tables_stats")
            let stats = JSON.parse(res)
            if (!stats) stats = {}

            let newstats = {}

            for (const [table, json] of Object.entries(stats)) {

                json.time = json.time - 1
                newstats[table] = json

                const { buffer, max_buffer, time } = json
                if (buffer >= max_buffer || time <= 0) {

                    let table_data = await redis.get(table)
                    let array = JSON.parse(table_data)

                    console.log("Insert to clickhouse", {
                        table, array, json
                    })
                    await CHouse.insertData(table, array)

                    await redis.del(table)
                    delete newstats[table]

                }
            }
            
            await redis.set("_tables_stats", JSON.stringify(newstats))

        }, 1000)
    }

    static async cacheData(body) {
        const { table, max_buffer, max_time, data } = body

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

        redis.set("_tables_stats", JSON.stringify(table_limits))
        redis.set(table, JSON.stringify(table_data))
    }
}