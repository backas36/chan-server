const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})
const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const userModel = require("../models/user")
const userAuthModel = require("../models/userAuth")
const { IDENTITY_TYPE, ACTION_TYPE, USER_ROLES,USER_STATUS } = require("../utils/constants")
const actionLogModel = require("../models/actionLog")
const {
  generateNewAccToken,
  generateResetPwdToken,
} = require("../utils/jwtHelper")
const redisCacheModel = require("../models/redisCache")
const mailService = require("../services/mailService")
const bcryptHelper = require("../utils/bcryptHelper")

const skipReqUserKeys = [
  "email",
  "identityType",
  "identifier",
  "password",
  "credential",
  "isNew"
]

const userService = {
  register: async (userDTO,) => {
    const { email, password } = userDTO
    try {
      const user = await userModel.findUserByEmail(email)
      if (!isEmpty(user)) {
        const err = createError(409, "User with email is already exists.")
        throw err
      }

      const registerData = omit(
        { ...userDTO, role: userDTO?.role || USER_ROLES.user },
        ["password"]
      )

      const hashPassword = bcryptHelper.hashData(password)

      const { id } = await userModel.createUser(registerData)

      await userAuthModel.createUserAuth({
        userId: id,
        identityType: IDENTITY_TYPE.chanchan,
        identifier: email,
        credential: hashPassword,
      })

      const actionLogData = {
        relatedUserId: id,
        actionType: ACTION_TYPE.createUser,
        actionSubject: "User Register",
        actionContent: JSON.stringify({
          ...registerData,
          identityType: IDENTITY_TYPE.chanchan,
        }),
      }

      await actionLogModel.createActionLog(actionLogData)

      return id
    } catch (err) {
      return Promise.reject(err)
    }
  },
  activeResetPassword: async (userDTO, password) => {
    const { email, resetPwdTokenId } = userDTO
    try {
      const cachedResetPwdToken = await redisCacheModel.getRedisByKey(
        resetPwdTokenId
      )
      if (!cachedResetPwdToken) {
        const err = createError(500, "Token already used")
        throw err
      }
      const hashPassword = bcryptHelper.hashData(password)
      const [user] = await userModel.findUserByEmail(email)
      if (isEmpty(user)) {
        const err = createError(400, `User does not exist.!`)
        throw err
      }
      await userAuthModel.updateUserAuthByUserId(user.id, {
        credential: hashPassword,
      })
      await actionLogModel.createActionLog({
        relatedUserId: user.id,
        actionType: ACTION_TYPE.resetPassword,
        actionSubject: "User reset password",
      })
      await redisCacheModel.delRedisByKey(resetPwdTokenId)
      await userModel.updateUserById(user.id, {status:USER_STATUS.active})

    } catch (err) {
      return Promise.reject(err)
    }
  },
  resendActivate:async(userId,currentUserName)=>{
    try{
      const findUser = await userModel.findUserById(userId)
      if (isEmpty(findUser)) {
        const err = createError(400, `User with id ${id} does not exist.!!`)
        throw err
      }
      const {id,...user} = omit(findUser[0], ["credential"])
      const { newAccTokenId, newAccToken } = generateNewAccToken({id,user})
      await redisCacheModel.storeRedis({
        key: newAccTokenId,
        value: newAccToken,
        timeType: "EX",
        time: process.env.JWT_NEW_ACCOUNT_TIME,
      })
      const actionLogData = {
        relatedUserId: id,
        actionType: ACTION_TYPE.resendActivate,
        actionSubject: `Resend Activate mail by ${currentUserName}`,
        actionContent: JSON.stringify({
          id,
          user,
        }),
      }
      await actionLogModel.createActionLog(actionLogData)
      await mailService.sendNewAccount(user.email, newAccToken)
    }catch(err){
      return Promise.reject(err)
    }
  },
  activeNewUser: async (userDTO, password) => {
    const { name, email, role, newAccTokenId } = userDTO
    try {
      const cachedAccToken = await redisCacheModel.getRedisByKey(newAccTokenId)
      if (!cachedAccToken) {
        const err = createError(500, "Account already active")
        throw err
      }
      await userModel.updateUserById(newAccTokenId,{status:USER_STATUS.active})

      const hashPassword = bcryptHelper.hashData(password)
      await userAuthModel.updateUserAuthById(newAccTokenId,{
        credential: hashPassword,
      })
      const actionLogData = {
        relatedUserId: newAccTokenId,
        actionType: ACTION_TYPE.activeAccount,
        actionSubject: `Active Account`,
        actionContent: JSON.stringify({
          ...userDTO,
          identityType: IDENTITY_TYPE.chanchan,
        }),
      }
      await actionLogModel.createActionLog(actionLogData)
      await redisCacheModel.delRedisByKey(newAccTokenId)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createUser: async (userDTO, currentUserName, currentUserId) => {
    const { email } = userDTO
    try {
      const user = await userModel.findUserByEmail(email)
      if (!isEmpty(user)) {
        const err = createError(409, "User with email is already exists.")
        throw err
      }
      const {id} = await userModel.createUser(userDTO)

      const { newAccTokenId, newAccToken } = generateNewAccToken({id,...userDTO})
      await userAuthModel.createUserAuth({
        userId:newAccTokenId,
        identityType: IDENTITY_TYPE.chanchan,
        identifier: email})
      await redisCacheModel.storeRedis({
        key: newAccTokenId,
        value: newAccToken,
        timeType: "EX",
        time: process.env.JWT_NEW_ACCOUNT_TIME,
      })
      const actionLogData = {
        relatedUserId: currentUserId,
        actionType: ACTION_TYPE.createUser,
        actionSubject: `Create User by ${currentUserName}`,
        actionContent: JSON.stringify({
          id,
          ...userDTO,
        }),
      }
      await actionLogModel.createActionLog(actionLogData)
      await mailService.sendNewAccount(email, newAccToken)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getUserById: async (id, identityType) => {
    try {
      const findUser = await userModel.findUserById(id, identityType)
      if (isEmpty(findUser)) {
        const err = createError(400, `User with id ${id} does not exist.!!`)
        throw err
      }
      const user = omit(findUser[0], ["credential"])

      return user
    } catch (err) {
      return Promise.reject(err)
    }
  },
  changeMyProfile: async (userDTO) => {
    const { userId, data } = userDTO
    try {
      const [user] = await userModel.findUserById(userId)
      if (isEmpty(user)) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }
      const updatedData = omit({ ...user, ...data }, skipReqUserKeys)
      await userModel.updateUserById(userId, updatedData)
      await actionLogModel.createActionLog({
        relatedUserId: userId,
        actionType: ACTION_TYPE.updateProfile,
        actionSubject: "User update account detail",
        actionContent: JSON.stringify(updatedData),
      })
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  changeMyPassword: async (pwdDTO) => {
    const { userId, data } = pwdDTO
    try {
      const userAuth = await userAuthModel.findUserAuthByUserId(
        userId,
        IDENTITY_TYPE.chanchan
      )

      if (isEmpty(userAuth)) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }
      const { originalPassword, newPassword } = data
      const compareOldPassword = bcryptHelper.compare(
        originalPassword,
        userAuth[0].credential
      )

      if (!compareOldPassword) {
        const error = createError(401, "Password incorrect")
        throw error
      }
      const hashNewPassword = bcryptHelper.hashData(newPassword)
      await userAuthModel.updateUserAuthByUserId(userId, {
        credential: hashNewPassword,
      })
      await actionLogModel.createActionLog({
        relatedUserId: userId,
        actionType: ACTION_TYPE.updatePwd,
        actionSubject: "User changed password",
      })
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  listUsers: async (requestParams) => {
    try {
      const users = await userModel.findAllUsers(requestParams)
      return users
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateUserById: async (userDTO, currentUserName) => {
    const { userId, data } = userDTO
    try {
      const [user] = await userModel.findUserById(userId)

      if (isEmpty(user)) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }

      const updatedData = omit({ ...user, ...data }, skipReqUserKeys)
      await userModel.updateUserById(userId, updatedData)
      const actionLogData = {
        relatedUserId: userId,
        actionType: ACTION_TYPE.updateAccount,
        actionSubject: `Update User by ${currentUserName}`,
        actionContent: JSON.stringify(updatedData),
      }
      await actionLogModel.createActionLog(actionLogData)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  deleteUserById: async (userId, currentUserName) => {
    try {
      const user = await userModel.findUserById(userId)
      if (user.length === 0) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }
      await userAuthModel.updateUserAuthByUserId(userId, {
        isDeleted: true,
      })
      await userModel.updateUserById(userId, { isDeleted: true })
      const actionLogData = {
        relatedUserId: userId,
        actionType: ACTION_TYPE.deleteAccount,
        actionSubject: `Delete User by ${currentUserName}`,
        actionContent: null,
      }
      await actionLogModel.createActionLog(actionLogData)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  resetPassword: async (email) => {
    try {
      const [user] = await userModel.findUserByEmail(email)
      if (isEmpty(user)) {
        const err = createError(400, "User with email is not exists.")
        throw err
      }
      if (user.identityType !== IDENTITY_TYPE.chanchan) {
        const error = createError(400, "You are not using ChanChan account.")
        throw  error
      }

      await userModel.updateUserById(user.id, {status:USER_STATUS.temporary})

      const { resetPwdTokenId, resetPwdToken } = generateResetPwdToken({
        email,
      })
      await redisCacheModel.storeRedis({
        key: resetPwdTokenId,
        value: resetPwdToken,
        timeType: "EX",
        time: process.env.JWT_RESET_PWD_TIME,
      })
      await mailService.sendResetPwd(email, resetPwdToken)
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
}

module.exports = userService
