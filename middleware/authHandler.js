const createError = require("http-errors")

const { IDENTITY_TYPE, JWT_TYPE } = require("../utils/constants")
const { verifyAccessToken } = require("../utils/jwtHelper")

module.exports = async (req, res, next) => {
  try {
    if (!req?.headers?.authorization) {
      next(createError(401))
      return
    }

    const accessToken = req?.headers?.authorization.split(" ")[1] || null
    if (!accessToken) {
      next(createError(401))
      return
    }

    const decodedToken = verifyAccessToken(accessToken)
    const { iss, type } = decodedToken
    if (iss !== IDENTITY_TYPE.chanchan && type !== JWT_TYPE.accessToken) {
      next(createError(401))
      return
    }
    req.user = { ...decodedToken }
    next()
  } catch (err) {
    if(err?.name === 'TokenExpiredError'){
      return next(createError(403, err.message))
    }
    next(createError(401))
  }
}
