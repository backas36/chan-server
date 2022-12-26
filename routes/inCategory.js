const express = require("express")
const router = express.Router()

const inCategoryController = require("../controllers/inCategor")
const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/", inCategoryController.listInCategory)
router.get("/:inCategoryId", inCategoryController.getInCategoryById)

router.post("/", editorAuthHandler, inCategoryController.createInCategory)
router.patch("/:inCategoryId",  editorAuthHandler, inCategoryController.updateInCategory)
router.delete("/:inCategoryId", editorAuthHandler, inCategoryController.deleteInCategory )

module.exports = router