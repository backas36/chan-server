const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")

const userService = require("../services/user")
const { IDENTITY_TYPE } = require("../utils/constants")
const redisCacheService = require("../services/redisCache")

const meController = {
  getMyProfile: async (req, res, next) => {
    try {
      const { userId } = req.user
      const findUser = await userService.getUserById(userId)
      res
        .status(200)
        .json({ success: true, message: "Get Me Info", user: findUser })
    } catch (err) {
      next(err)
    }
  },
  changeMyProfile: async (req, res, next) => {
    try {
      const { userId } = req.user
      const { name, email } = req.body
      if (!name || !email) {
        const error = createError(400, "Please enter fields completely.")
        return next(error)
      }
      await userService.changeMyProfile({ userId, data: req.body })
      res.status(200).json({ success: true, message: "Profile Updated" })
    } catch (err) {
      next(err)
    }
  },
  changeMyPassword: async (req, res, next) => {
    try {
      const { userId } = req.user
      if (req.user) {
        const userAuth = await userService.getUserById(userId)
        if (userAuth.identityType !== IDENTITY_TYPE.chanchan) {
          const error = createError(400, "You are not using ChanChan account.")
          return next(error)
        }
      }
      const { originalPassword, newPassword, newOkPassword } = req.body
      if (!originalPassword || !newPassword || !newOkPassword) {
        const error = createError(400, "Please enter fields completely.")
        return next(error)
      }

      if (newPassword !== newOkPassword) {
        const error = createError(
          400,
          "Confirm password doesn't match New password."
        )
        return next(error)
      }

      if (originalPassword === newPassword) {
        const error = createError(
          400,
          "New password cannot be same as original password."
        )
        return next(error)
      }
      await userService.changeMyPassword({ userId, data: req.body })
      await redisCacheService.delAllRtByUserId(userId)
      res.status(200).json({ success: true, message: "Password Updated" })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = meController
