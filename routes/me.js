const express = require("express")
const router = express.Router()

const meController = require("../controllers/me")

router.get("/", meController.getMyProfile)
router.post("/password", meController.changeMyPassword)
router.post("/profile", meController.changeMyProfile)

module.exports = router
