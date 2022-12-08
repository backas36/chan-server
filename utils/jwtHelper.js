const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

const { JWT_TYPE } = require("./constants")
const accessTokenConfig = {
  expiresIn: process.env.JWT_ACCESS_TIME,
  issuer: process.env.JWT_ISSUER,
}
const refreshTokenConfig = {
  expiresIn: process.env.JWT_REFRESH_TIME,
  issuer: process.env.JWT_ISSUER,
}
const newAccountConfig = {
  expiresIn: process.env.JWT_NEW_ACCOUNT_TIME,
  issuer: process.env.JWT_ISSUER,
}
const resetPwdConfig = {
  expiresIn: process.env.JWT_RESET_PWD_TIME,
  issuer: process.env.JWT_ISSUER,
}
const jwtHelper = {
  verifyResetPwdToken: (token) => {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_RESET_PWD_SECRET,
      null,
      null
    )
    return decodedToken
  },
  generateResetPwdToken: (payload) => {
    const resetPwdTokenId = uuidv4()
    const resetPwdToken = jwt.sign(
      { ...payload, type: JWT_TYPE.resetPwd, resetPwdTokenId },
      process.env.JWT_RESET_PWD_SECRET,
      resetPwdConfig,
      null
    )
    return { resetPwdTokenId, resetPwdToken }
  },
  verifyNewAccToken: (token) => {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_NEW_ACCOUNT_SECRET,
      null,
      null
    )
    return decodedToken
  },
  generateNewAccToken: (payload) => {
    const newAccTokenId = uuidv4()
    const newAccToken = jwt.sign(
      { ...payload, type: JWT_TYPE.newAccount, newAccTokenId },
      process.env.JWT_NEW_ACCOUNT_SECRET,
      newAccountConfig,
      null
    )
    return { newAccTokenId, newAccToken }
  },
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
