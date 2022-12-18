const express = require("express")
const router = express.Router()

const inCategoryController = require("../controllers/inCategor")
const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/", inCategoryController.listInCategory)
router.get("/:inCategoryId", inCategoryController.getInCategoryById)

router.post("/",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, inCategoryController.createInCategory)
router.patch("/:inCategoryId", authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, inCategoryController.updateInCategory)
router.delete("/:inCategoryId",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, inCategoryController.deleteInCategory )

module.exports = router