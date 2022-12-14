const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const redisCacheModel = require("../models/redisCache")

const redisCacheService = {
  storedRefreshToken: async (key, value) => {
    try {
      if (!key || !value) {
        const err = createError(500, "InternalServerError")
        throw err
      }
      await redisCacheModel.storeRedis({
        key: key,
        value: value,
        timeType: "EX",
        time: process.env.JWT_REFRESH_TIME,
      })
    } catch (err) {
      return Promise.reject(err)
    }
  },
  delStoredToken: async (key) => {
    try {
      if (!key) {
        const err = createError(500, "InternalServerError")
        throw err
      }
      return await redisCacheModel.delRedisByKey(key)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getRedisCacheByKey: async (key) => {
    try {
      if (!key) {
        const err = createError(500, "InternalServerError")
        throw err
      }
      const cachedData =  await redisCacheModel.getRedisByKey(key)
      return cachedData
    } catch (err) {
      return Promise.reject(err)
    }
  },
  delAllRtByUserId: async (userId) => {
    const scanConfig = {
      TYPE: "string",
      MATCH: `${userId}*`,
      COUNT: 100,
    }
    try {
      const keys = await redisCacheModel.scanAllKeys(userId, scanConfig)
      if (!isEmpty(keys)) {
        for (let i = 0; i < keys.length; i++) {
          await redisCacheModel.delRedisByKey(keys[i])
        }
      }
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
module.exports = redisCacheService
