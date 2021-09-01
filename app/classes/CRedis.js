const Redis = require("ioredis");


class CRedis {

    constructor(){
        if (!!CRedis.instance) {
            return CRedis.instance;
        }
        CRedis.instance = this;

        this.options = {
            host: "redis"
        };
        this.redis = new Redis(this.options)

        return this;
    }


    connect() {
        return new Promise((res, rej) => {
                
                this.redis.ping(function (err, result) {
                    if(result != "PONG") return rej(err)

                    console.log("Connect to redis succesful")
                    res(result);
                })           
        })
    }


}


module.exports = () => new CRedis()