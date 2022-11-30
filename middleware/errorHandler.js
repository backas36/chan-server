const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  console.log(err.stack)
  const status = res.statusCode ? res.statusCode : 500
  res.status(status)
  res.json({ success: false, message: err.message })
}

module.exports = errorHandler
