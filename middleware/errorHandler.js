const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  console.log(err.stack)

  let message

  if(!err.message || !err?.statusCode  ){
    message = "Something went wrong"
  }else {
    message = err.message
  }

  const status = err.statusCode ? err.statusCode : 500
  res.status(status)
  res.json({ success: false, message: message, isError:true })
}

module.exports = errorHandler
