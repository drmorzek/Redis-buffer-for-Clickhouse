const { ClickHouse } = require('clickhouse');
const { CLICKHOUSE } = require("../config/keys")



class CHouse {

    constructor() {
        if (!!CHouse.instance) {
            return CHouse.instance;
        }
        CHouse.instance = this;

        this.options = {
            host: CLICKHOUSE.HOST,
            debug: false,
            basicAuth: null,
            isUseGzip: false,
            format: "json",
            raw: false,
            config: {
                database: CLICKHOUSE.DB,
            }
        };

        this.clickhouse = new ClickHouse(this.options)

        return this;
    }

    async insertData(table, data = []) {

        const r = await this.clickhouse.query(`CREATE TABLE IF NOT EXISTS redis_${table} (json String) ENGINE = MergeTree() ORDER BY json`).toPromise();
        console.log(r);

        const ws = this.clickhouse.insert(`INSERT INTO redis_${table}(json)`).stream();
        for (const row of data) {
            await ws.writeRow(
                [JSON.stringify(row)]
            );
        }
        const result = await ws.exec();
        return result
    }

    async getData(table) {
        const result = await this.clickhouse.query(`SELECT * FROM redis_${table};`).toPromise();
        return result
    }

    async dropTable(table) {
        const result = await this.clickhouse.query(`drop table redis_${table};`).toPromise();
        return result
    }

    connect() {
        return new Promise((res, rej) => {
            
            const check = this.clickhouse.query(`SELECT now()`).toPromise();

            check
                .then(result => {
                    console.log("Connect to clickhouse succesful")
                    res(result)
                })
                .catch(e => rej(e))
        })
    }

}

module.exports = () => new CHouse()