const express = require("express")
const router = express.Router()

const poCategoryController = require("../controllers/poCategory")
const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const editorAuthHandler = require("../middleware/editorAuthHandler");


router.get("/", poCategoryController.listProducts)
router.get("/:poCategoryId", poCategoryController.getPoCategoryById)

router.post("/",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler,poCategoryController.createPoCategory)
router.patch("/:poCategoryId", authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, poCategoryController.updatePoCategory)
router.delete("/:poCategoryId",  authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, poCategoryController.deletePoCategory)
module.exports = router