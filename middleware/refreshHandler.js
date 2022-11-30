const createError = require("http-errors")
const { verifyRefreshToken } = require("../utils/jwtHelper")
const { IDENTITY_TYPE, JWT_TYPE } = require("../utils/constants")
const redisCacheService = require("../services/redisCache")

module.exports = async (req, res, next) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    next(createError.Unauthorized("No token provided"))
    return
  }
  try {
    const decodedToken = verifyRefreshToken(refreshToken)
    const { iss, type, jti } = decodedToken

    if (
      iss !== IDENTITY_TYPE.chanchan ||
      type !== JWT_TYPE.refreshToken ||
      !jti
    ) {
      next(createError.Unauthorized("Invalid token"))
      return
    }

    req.user = decodedToken
    next()
    return
  } catch (err) {
    next(createError.Unauthorized("Unauthorized / Invalid token"))
  }
}
