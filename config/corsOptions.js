const allowedOrigins = require("./allowedOrigins")

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin."
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
}

module.exports = corsOptions
