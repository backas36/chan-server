const actionLogModel = require("../models/actionLog")
const actionLogService = {
  listActionLog: async (requestParams) => {
    try {
      const actionList = await actionLogModel.findAllActionLog(requestParams)
      return actionList
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
module.exports = actionLogService
