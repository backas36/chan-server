const { createClient } = require("redis")
const logger = require("../utils/logger")

const redisClient = createClient({
  url: process.env.REDIS_URI,
})

redisClient.on("connect", () => {
  logger.info("Client connected to redis...")
})

redisClient.on("ready", () => {
  logger.info("Client connected to redis and ready to use...")
})

redisClient.on("error", (err) => {
  logger.error(err.message)
})

redisClient.on("end", () => {
  logger.info("Client disconnected from redis")
})

const redisConnect = async () => {
  await redisClient.connect()
}
redisConnect()

module.exports = redisClient
