const isEmpty = require("lodash/isEmpty")
const createError = require("http-errors")

const userModel = require("../models/user")
const { USER_STATUS, IDENTITY_TYPE } = require("../utils/constants")
const bcryptHelper = require("../utils/bcryptHelper")
const { generateJwtTokens } = require("../utils/jwtHelper")
const redisCacheService = require("./redisCache")

const authService = {
  login: async (loginDTO) => {
    const { email, password } = loginDTO
    try {
      const user = await userModel.findUserByEmail(
        email,
        IDENTITY_TYPE.chanchan
      )
      if (isEmpty(user)) {
        const err = createError(
          400,
          "Please register a new account or login with other social accounts"
        )
        throw err
      }
      if (user[0].status !== USER_STATUS.active) {
        const err = createError(
          403,
          "This account has been suspended! Try to contact the admin."
        )
        throw err
      }

      const hashPassword = user[0]?.credential
      const comparePassword = bcryptHelper.compare(password, hashPassword)
      if (!comparePassword) {
        const err = createError(401, "Password incorrect")
        throw err
      }
      await userModel.updateUserLoginTime(user[0]?.id)
      const { accessToken, refreshToken, refreshTokenId } = generateJwtTokens({
        userId: user[0].id,
        role: user[0].role,
        status: user[0].status,
      })
      await redisCacheService.storedRefreshToken(
        `${user[0].id}_${refreshTokenId}`,
        refreshToken
      )
      return { accessToken, refreshToken }
    } catch (err) {
      return Promise.reject(err)
    }
  },
  logout: async (id, jti) => {
    try {
      const [findUser] = await userModel.findUserById(id)
      if (isEmpty(findUser)) {
        const err = createError(400, `User with ${id} does not exist`)
        throw err
      }
      await redisCacheService.delStoredToken(`${id}_${jti}`)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
module.exports = authService
