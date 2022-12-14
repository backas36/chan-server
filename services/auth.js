const isEmpty = require("lodash/isEmpty")
const createError = require("http-errors")

const userModel = require("../models/user")
const {
  USER_STATUS,
  IDENTITY_TYPE,
  USER_ROLES,
  ACTION_TYPE,
} = require("../utils/constants")
const bcryptHelper = require("../utils/bcryptHelper")
const { generateJwtTokens } = require("../utils/jwtHelper")
const redisCacheService = require("./redisCache")
const actionLogModel = require("../models/actionLog")
const userAuthModel = require("../models/userAuth")

const authService = {
  login: async (loginDTO) => {
    const { email, password } = loginDTO
    try {
      const user = await userModel.findUserByEmail(email)
      if (isEmpty(user)) {
        const err = createError(
          400,
          "Please register a new account or login with other social accounts"
        )
        throw err
      }
      if(user[0].identityType === IDENTITY_TYPE.google){
        const err = createError(400,"Please login with social account.")
        throw err
      }
      if(user[0].status !== USER_STATUS.active){
        const err = createError(
            401,
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

      const { accessToken, refreshToken, refreshTokenId } = generateJwtTokens({
        userId: user[0].id,
        role: user[0].role,
        status: user[0].status,
      })
      const refreshTokenKey = `${user[0].id}_${refreshTokenId}`
      await redisCacheService.storedRefreshToken(
          refreshTokenKey,
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
      const cachedRefreshToken = await redisCacheService.getRedisCacheByKey(
        `${id}_${jti}`
      )
      if (!cachedRefreshToken) {
        await redisCacheService.delAllRtByUserId(id)
        const error = createError(404)
        throw error
      }
      await redisCacheService.delStoredToken(`${id}_${jti}`)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  refresh: async (authUser) => {
    const { userId, jti, role, status } = authUser
    try {
      const cachedRefreshToken = await redisCacheService.getRedisCacheByKey(
        `${userId}_${jti}`
      )
      if (!cachedRefreshToken) {
        // await redisCacheService.delAllRtByUserId(userId)
        const error = createError(404)
        throw error
      }
      await redisCacheService.delStoredToken(`${userId}_${jti}`)
      const { accessToken, refreshToken, refreshTokenId } = generateJwtTokens({
        userId,
        role,
        status,
      })
      await redisCacheService.storedRefreshToken(
        `${userId}_${refreshTokenId}`,
        refreshToken
      )
      return { accessToken, refreshToken }
    } catch (err) {
      return Promise.reject(err)
    }
  },
  verifyById: async (id) => {
    try {
      const [findUser] = await userModel.findUserById(id)
      if (isEmpty(findUser)) {
        const err = createError(400, `User with ${id} does not exist`)
        throw err
      }
      const user = findUser
      const authUser = {
        userId: user.id,
        role: user?.role || "unknown",
        identityType: user.identityType,
        status: user.status,
      }
      await userModel.updateUserLoginTime(user.id)
      return authUser
    } catch (err) {
      return Promise.reject(err)
    }
  },
  verifyByGoogle: async (userDTO) => {
    const { name, email, photoUrl, reqVerifyType } = userDTO
    // let userId
    let authUser
    try {
      // first time login to web and with Google
      const [findUser] = await userModel.findUserByEmail(email)
      if (isEmpty(findUser)) {
        const { id } = await userModel.createUser({
          name,
          email,
          photoUrl,
          role: USER_ROLES.user,
          lastLoginAt: new Date().toISOString(),
        })
        await userAuthModel.createUserAuth({
          userId: id,
          identityType: reqVerifyType,
          identifier: email,
        })
        authUser = {
          userId: id,
          role: USER_ROLES.user,
          identityType: reqVerifyType,
          statusCode: USER_STATUS.active,
        }
        await actionLogModel.createActionLog({
          relatedUserId: id,
          actionType: ACTION_TYPE.createUser,
          actionSubject: "Register By Google",
          actionContent: JSON.stringify({
            ...authUser,
          }),
        })
      } else {
        const user = findUser

        await userModel.updateUserById(user.id, { name, photoUrl })
        authUser = {
          userId: user.id,
          role: user.role || "unknown",
          identityType: user.identityType,
          status: user.status,
        }
      }

      await userModel.updateUserLoginTime(authUser.userId)

      const { accessToken, refreshToken, refreshTokenId } = generateJwtTokens({
        userId: authUser.userId,
        role: authUser.role,
        status: authUser.status,
      })
      await redisCacheService.storedRefreshToken(
        `${authUser.userId}_${refreshTokenId}`,
        refreshToken
      )

      return { accessToken, refreshToken }
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
module.exports = authService
