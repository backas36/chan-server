const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth")
const refreshHandler = require("../middleware/refreshHandler")
const authHandler = require("../middleware/authHandler")
const googleAuthHandler = require("../middleware/googleAuthHandler")
const loginLimiter = require("../middleware/loginLimiter")

router.post("/login", loginLimiter, authController.login)
router.post("/logout", refreshHandler, authController.logout)
router.post("/refresh", refreshHandler, authController.refreshToken)

router.get("/verify", authHandler, authController.verify)
router.get(
  "/verify/google-login",
  googleAuthHandler,
  authController.verifyWithGoogle
)
module.exports = router
