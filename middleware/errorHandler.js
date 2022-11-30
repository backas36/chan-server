const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  console.log(err.stack)
  const status = err.statusCode ? err.statusCode : 500
  res.status(status)
  res.json({ success: false, message: err.message || "Something went wrong" })
}

module.exports = errorHandler
