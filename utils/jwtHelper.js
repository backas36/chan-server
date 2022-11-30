require("dotenv").config()
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

const { JWT_TYPE } = require("./constants")
const accessTokenConfig = {
  expiresIn: process.env.JWT_ACCESS_TIME,
  issuer: process.env.JWT_ISSURE,
}
const refreshTokenConfig = {
  expiresIn: process.env.JWT_REFRESH_TIME,
  issuer: process.env.JWT_ISSURE,
}
const newAccountConfig = {
  expiresIn: process.env.JWT_NEW_ACCOUNT_TIME,
  issuer: process.env.JWT_ISSURE,
}

const jwtHelper = {
  verifyAccessToken: (accessToken) => {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET,
      null,
      null
    )
    return decodedAccessToken
  },
  verifyRefreshToken: (refreshToken) => {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      null,
      null
    )
    return decodedRefreshToken
  },
  generateJwtTokens: (payload) => {
    const refreshTokenId = uuidv4()
    const accessToken = jwtHelper.generateAccessToken({
      ...payload,
      refreshTokenId,
    })
    const refreshToken = jwtHelper.generateRefreshToken({
      ...payload,
      jti: refreshTokenId,
    })
    return { accessToken, refreshToken, refreshTokenId }
  },
  generateAccessToken: (payload) => {
    return jwt.sign(
      { ...payload, type: JWT_TYPE.accessToken },
      process.env.JWT_ACCESS_SECRET,
      accessTokenConfig,
      null
    )
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(
      { ...payload, type: JWT_TYPE.refreshToken },
      process.env.JWT_REFRESH_SECRET,
      refreshTokenConfig,
      null
    )
  },
}
module.exports = jwtHelper
