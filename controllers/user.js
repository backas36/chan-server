const createError = require("http-errors")

const userService = require("../services/user")
const { isGuidValid } = require("../utils")
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
}
module.exports = userController
