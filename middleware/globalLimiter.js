const rateLimit = require("express-rate-limit")
const logger = require("../utils/logger")

const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000,
  message: {
    message: "Too many requests, please try again later.",
  },
  handler: (req, res, next, options) => {
    logger.error(
      `${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    )
    res.status(options.statusCode).send(options.message)
  },
  standardHandler: true,
  legacyHandler: false,
})

module.exports = globalLimiter
