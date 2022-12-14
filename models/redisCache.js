const redisClient = require("../config/redisClient")

const redisClientModel = {
  storeRedis: async ({ key, value, timeType, time }) => {
    let valueConfig = {}
    if (timeType || time) {
      valueConfig = { [timeType]: parseInt(time, 10)/1000 }
    }
    return await redisClient.set(key, value, valueConfig)
  },
  getRedisByKey: async (key) => {
    const cacheData = await redisClient.get(key)
    return cacheData
  },
  delRedisByKey: async (key) => {
    return await redisClient.del(key)
  },
  scanAllKeys: async (key, scanConfig) => {
    let keys = []
    for await (const key of redisClient.scanIterator(scanConfig)) {
      keys.push(key)
    }
    return keys
  },
}

module.exports = redisClientModel
