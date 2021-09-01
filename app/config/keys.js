require('dotenv').config()

module.exports = {
    HTTP_PORT: process.env.PORT || 3000,
    CLICKHOUSE:{
        HOST: process.env.CLICKHOUSE_HOST || 'localhost',
        DB: process.env.CLICKHOUSE_DB || "default"
        
    }

}