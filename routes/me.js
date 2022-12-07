const express = require("express")
const router = express.Router()

const meController = require("../controllers/me")

router.get("/", meController.getMyProfile)
router.patch("/password", meController.changeMyPassword)
router.patch("/profile", meController.changeMyProfile)

module.exports = router
