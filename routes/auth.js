const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth")
const refreshHandler = require("../middleware/refreshHandler")

router.post("/login", authController.login)
router.post("/logout", refreshHandler, authController.logout)

module.exports = router
