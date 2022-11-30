const createError = require("http-errors")

const authService = require("../services/auth")
const redisCacheService = require("../services/redisCache")
const { IDENTITY_TYPE } = require("../utils/constants")

const authController = {
  login: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      const error = createError(400, "Please enter fields completely.")
      next(error)
      return
    }
    try {
      const tokens = await authService.login(req.body)

      res.status(200).json({ success: true, message: "User login", tokens })
    } catch (err) {
      next(err)
    }
  },
  logout: async (req, res, next) => {
    const { jti, userId } = req.user
    try {
      await authService.logout(userId, jti)

      res.status(200).json({ success: true, message: "User logout" })
    } catch (err) {
      next(err)
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const tokens = await authService.refresh(req.user)
      res
        .status(200)
        .json({ success: true, message: "Refreshed Token", tokens })
    } catch (err) {
      next(err)
    }
  },
  verify: async (req, res, next) => {
    try {
      const user = req.user
      const { userId } = user

      const authUser = await authService.verifyById(userId)
      res.status(200).json({
        success: true,
        message: "Verified successfully",
        verifiedUser: authUser,
      })
    } catch (err) {
      next(err)
    }
  },
  verifyWithGoogle: async (req, res, next) => {
    try {
      const tokens = await authService.verifyByGoogle(req.user)
      res.status(200).json({
        success: true,
        message: "Verified with google oauth successfully",
        tokens,
      })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = authController
