const express = require("express")
const router = express.Router()

const actionLogController = require("../controllers/actionLog")

router.get("/", actionLogController.listAllActionsLog)
router.get("/:logId", actionLogController.getActionLogById)

module.exports = router
