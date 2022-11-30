const redisClient = require("../config/redisClient")

const redisClientModel = {
  storeRedis: async ({ key, value, timeType, time }) => {
    let valueConfig = {}
    if (timeType || time) {
      valueConfig = { [timeType]: parseInt(time, 10) }
    }
    return await redisClient.set(key, value, valueConfig)
  },
  getRedisByKey: async (key) => {
    return await redisClient.get(key)
  },
  delRedisByKey: async (key) => {
    return await redisClient.del(key)
  },
  scanAllKeys: async (key, scanConfig) => {
    //const scanConfig = {
    //  TYPE: "string",
    //  MATCH: `${key}*`,
    //  COUNT: 100,
    //}
    let keys = []
    for await (const key of redisClient.scanIterator(scanConfig)) {
      keys.push(key)
    }
    return keys
  },
}

module.exports = redisClientModel
