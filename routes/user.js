const express = require("express")
const router = express.Router()

const userController = require("../controllers/user")
const editorAuthHandler = require("../middleware/editorAuthHandler")

router.get("/", userController.listUsers)
router.get("/:userId", userController.getUserById)

router.post("/", editorAuthHandler, userController.createUser)
router.patch("/:userId", editorAuthHandler, userController.updateUserById)
router.delete("/:userId", editorAuthHandler, userController.deleteUserById)

router.get("/resend-activate/:userId", editorAuthHandler,userController.resendActivate)

module.exports = router
