const createError = require("http-errors")

const actionLogService = require("../services/actionLog")
const {isGuidValid} = require("../utils");

const listActionLog = {
  listAllActionsLog: async (req, res, next) => {
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
  getActionLogById:async(req,res,next) => {
    const logId = req.params.logId
    if(!isGuidValid(logId)){
      const error = createError(400, "Invalid log id.")
      return next(error)
    }
    try{
      const actionLog = await actionLogService.getActionLogById(logId)
      res.status(200).json({success:true, message:"Get Action", actionLog})
    }catch(err){
      next(err)
    }
  }
}
module.exports = listActionLog
