const express = require("express")
const router = express.Router()

const unitsController = require("../controllers/units")
const editorAuthHandler = require("../middleware/editorAuthHandler")

router.get("/", unitsController.getAllUnits)
router.get("/", unitsController.getUnit)

router.post("/", editorAuthHandler,unitsController.createUnit)
router.patch("/:unitId",editorAuthHandler, unitsController.updateUnit)
router.delete("/unitId",editorAuthHandler, unitsController.deleteUnit)

module.exports = router
