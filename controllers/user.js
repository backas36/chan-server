const createError = require("http-errors")

const userService = require("../services/user")
const { isGuidValid } = require("../utils")
const { verifyNewAccToken, verifyResetPwdToken } = require("../utils/jwtHelper")
const {passwordValidate} = require("../utils/regexPattern");
//const smtpMailService = require("../services/smtpMail")
//const { generateNewAccToken } = require("../utils/jwtHelper")
//const redisCacheService = require("../services/redisCache")

const userController = {
  listUsers: async (req, res, next) => {
    const requestParams = req.query
    try {
      const users = await userService.listUsers(requestParams)
      res.status(200).json({ success: true, message: "Get All Users", users })
    } catch (err) {
      next(err)
    }
  },
  getUserById: async (req, res, next) => {
    const userId = req.params.userId

    if (!isGuidValid(userId)) {
      const error = createError(400, "Invalid user id.")
      return next(error)
    }

    try {
      const user = await userService.getUserById(userId)
      res.status(200).json({ success: true, message: "Get User Info", user })
    } catch (err) {
      next(err)
    }
  },
  deleteUserById: async (req, res, next) => {
    const userId = req.params.userId
    if (!isGuidValid(userId)) {
      const error = createError(400, "Invalid user id.")
      return next(error)
    }
    try {
      await userService.deleteUserById(userId, req.user.currentUserName)
      res.status(200).json({ success: true, message: "User Deleted." })
    } catch (err) {
      next(err)
    }
  },
  updateUserById: async (req, res, next) => {
    const userId = req.params.userId
    const { email, role } = req.body

    if (!isGuidValid(userId)) {
      const error = createError(400, "Invalid user id.")
      return next(error)
    }
    if (!email) {
      const error = createError(422, "Email cannot be empty.")
      return next(error)
    }
    if (!role) {
      const error = createError(400, "User role cannot be empty.")
      return next(error)
    }

    try {
      await userService.updateUserById(
        {
          userId,
          data: req.body,
        },
        req.user.currentUserName
      )
      res.status(200).json({ success: true, message: "Profile Updated" })
    } catch (err) {
      next(err)
    }
  },
  activeAccount: async (req, res, next) => {
    const { token, password } = req.body
    if (!token || !password) {
      const error = createError(400)
      return next(error)
    }
    if(!passwordValidate(password)){
      const error = createError(400, "Password must at least 8 characters, and must includes numbers and special" +
          " characters.")
      return next(error)
    }
    try {
      const decodedToken = verifyNewAccToken(token)
      const id = await userService.activeNewUser(decodedToken, password)
      res
        .status(201)
        .json({ success: true, message: "User account activated ", userId: id })
    } catch (err) {
      next(err)
    }
  },
  createUser: async (req, res, next) => {
    const { role, name, email } = req.body
    if (![role,name,email].every(Boolean)) {
      const error = createError(400, "Please enter fields completely.")
      return next(error)
    }
    try {
      await userService.createUser(
        req.body,
        req.user.currentUserName,
        req.user.userId
      )
      //const token = generateNewAccToken({ name, email, birthDate, userId: id })
      //await redisCacheService.saveNewAccountToken(id, token)
      //await smtpMailService.sendNewAccount(email, token)
      res.status(201).json({ success: true, message: "User created" })
    } catch (err) {
      next(err)
    }
  },
  register: async (req, res, next) => {
    const { name, email, password } = req.body
    if (![name, email, password].every(Boolean)) {
      const error = createError(400, "Please enter fields completely.")
      return next(error)
    }
    if(!passwordValidate(password)){
      const error = createError(400, "Password must at least 8 characters, and must includes numbers and special" +
          " characters.")
      return next(error)
    }
    try {
      const id = await userService.register(req.body)
      res
        .status(201)
        .json({ success: true, message: "User created", userId: id })
    } catch (err) {
      next(err)
    }
  },
  resetPassword: async (req, res, next) => {
    const { email } = req.body
    if (!email) {
      const error = createError(400, "Please provide email.")
      return next(error)
    }
    try {
      await userService.resetPassword(email)

      res
        .status(200)
        .json({ success: true, message: "Send reset password to user's mail" })
    } catch (err) {
      next(err)
    }
  },
  activeResetPassword: async (req, res, next) => {
    const { token, password } = req.body
    if (!token || !password) {
      const error = createError(400)
      return next(error)
    }
    if(!passwordValidate(password)){
      const error = createError(400, "Password must at least 8 characters, and must includes numbers and special" +
          " characters.")
      return next(error)
    }
    try {
      const decodedToken = verifyResetPwdToken(token)
      await userService.activeResetPassword(decodedToken, password)
      res.status(201).json({
        success: true,
        message: "User reset password",
      })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = userController
