const express = require("express")
const router = express.Router()

const poImageController = require("../controllers/poImage")

const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const editorAuthHandler = require("../middleware/editorAuthHandler")

router.get("/", poImageController.listAllImages)
router.get("/:productId", poImageController.listImgByPoId)

router.post("/",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, poImageController.createProduct)
router.patch("/:poImageId",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, poImageController.updatePoImage)
router.delete("/:poImageId",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, poImageController.deletePoImage)


module.exports = router