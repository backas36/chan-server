const rateLimit = require("express-rate-limit")
const logger = require("../utils/logger")

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
  handler: (req, res, next, options) => {
    logger.error(
      `Too many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    )
    res.status(options.statusCode).send(options.message)
  },
  standardHandler: true,
  legacyHandler: false,
})

module.exports = loginLimiter
