const createError = require("http-errors")

const authService = require("../services/auth")
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
}
module.exports = authController
