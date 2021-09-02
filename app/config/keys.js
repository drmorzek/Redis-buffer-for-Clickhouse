require('dotenv').config()

module.exports = {
    HTTP_PORT: process.env.PORT || 3000,
    CLICKHOUSE:{
        HOST: process.env.CLICKHOUSE_HOST || 'localhost',
        DB: process.env.CLICKHOUSE_DB || "default"        
    },
    REDIS: {
        HOST: process.env.REDIS_HOST || "localhost",
        PORT: process.env.REDIS_PORT || 6379
    }

}