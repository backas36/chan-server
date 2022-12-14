const express = require("express")
const router = express.Router()

const meController = require("../controllers/me")
const userStatusHandler = require("../middleware/userStatusHandler");

router.get("/", meController.getMyProfile)
router.patch("/password",userStatusHandler, meController.changeMyPassword)
router.patch("/profile",userStatusHandler, meController.changeMyProfile)

module.exports = router
