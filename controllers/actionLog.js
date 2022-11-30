const actionLogService = require("../services/actionLog")

const listActionLog = {
  listAllActionLog: async (req, res, next) => {
    const requestParams = req.query
    try {
      const actionList = await actionLogService.listActionLog(requestParams)

      res
        .status(200)
        .json({ success: true, message: "Get All action log", actionList })
    } catch (err) {
      next(err)
    }
  },
}
module.exports = listActionLog
