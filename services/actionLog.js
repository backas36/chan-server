const actionLogModel = require("../models/actionLog")
const isEmpty = require("lodash/isEmpty")
const createError = require("http-errors");

const actionLogService = {
  listActionLog: async (requestParams) => {
    try {
      const actionList = await actionLogModel.findAllActionLog(requestParams)
      return actionList
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getActionLogById:async (id) => {
    try{
      const findActionLog = await actionLogModel.findActionById(id)
      if(isEmpty(findActionLog)){
        const err = createError(400, `Action Log with id ${id} does not exist.!!`)
        throw err
      }
      return findActionLog
    }catch(err){
      return Promise.reject(err)
    }
  }
}
module.exports = actionLogService
