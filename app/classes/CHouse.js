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

        return this;
    }

    async insertData(table, data = []) {
        const r = await this.clickhouse.query(`CREATE TABLE IF NOT EXISTS ${table} (json String) ENGINE = MergeTree() ORDER BY json`).toPromise();
        console.log(r);


        const ws = this.clickhouse.insert(`INSERT INTO ${table}(json)`).stream();
        for (const row of data) {
            await ws.writeRow(
                [JSON.stringify(row)]
            );
        }
        const result = await ws.exec();
        return result
    }

    async getData(table) {
        const result = await this.clickhouse.query(`SELECT * FROM ${table};`).toPromise();
        return result
    }

    async dropTable(table) {
        const result = await this.clickhouse.query(`drop table ${table};`).toPromise();
        return result
    }

    connect() {
        return new Promise((res, rej) => {
            this.clickhouse = new ClickHouse(this.options)
            const check = this.clickhouse.query(`SELECT now()`).toPromise();

            check.then(result => res(result))
                .catch(e => rej(e))
        })
    }

}

module.exports = () => new CHouse()