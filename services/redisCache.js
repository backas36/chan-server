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
}
module.exports = redisCacheService
