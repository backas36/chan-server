const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")

const unitsModel = require("../models/units")
const actionLogModel = require("../models/actionLog")

const unitsService ={
    listUnits:async (params) => {
        try{
            const units = unitsModel.findAllUnits(params)
            return units
        }catch(err){
            return Promise.reject(err)
        }
    },
    getUnit:async () => {
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    createUnit:async(unitDTO,currentUserName, currentUserId)=>{
        try{
            const id = await unitsModel.createUnit(unitDTO)
            const actionLogData = {
                relatedUserId:currentUserId,
                actionType:"Create Unit",
                actionSubject:`Create Unit by  ${currentUserName}`,
                actionContent:JSON.stringify({
                    id,
                    ...unitDTO
                })
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateUnit:async (unitDTO,currentUserName, currentUserId ) => {
        const { unitId, data } = unitDTO
        try{
            const findUnit = await unitsModel.findUnitById(unitId)
            if(isEmpty(findUnit)){
                const err = createError(400, `Unit with id ${unitId} does not exist.!`)
                throw err
            }
            await unitsModel.updateUnitById(unitId, data)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated Unit",
                actionSubject: `Updated Unit by ${currentUserName}`,
                actionContent: JSON.stringify(unitDTO),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteUnit:async (unitId,currentUserName,currentUserId) => {
        try{
            const findUnit = await unitsModel.findUnitById(unitId)
            if(isEmpty(findUnit)){
                const err = createError(400, `Unit with id ${unitId} does not exist.!`)
                throw err
            }
            await unitsModel.updateUnitById(unitId, {
                isDeleted: true,
            })
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: `Delete Unit`,
                actionSubject: `Delete Unit by ${currentUserName}`,
                actionContent: null,
            }
            await actionLogModel.createActionLog(actionLogData)

        }catch(err){
            return Promise.reject(err)
        }
    },

}

module.exports = unitsService
