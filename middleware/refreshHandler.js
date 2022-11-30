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

/**
 * 
 * {
  "userId": "d1b9ce0d-d61d-41ed-84b0-6b5f22c730a5",
  "role": "super admin",
  "status": "active",
  "jti": "a185c1ae-8d60-44b0-8d9a-dabee89eee5f",
  "type": "REFRESH TOKEN",
  "iat": 1669798285,
  "exp": 1670057485,
  "iss": "chanchan-api"
}
 */
