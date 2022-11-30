const express = require("express")
const router = express.Router()

const actionLogController = require("../controllers/actionLog")

router.get("/", actionLogController.listAllActionLog)

module.exports = router
