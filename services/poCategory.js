const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const unitService = require("./units");
const unitsModel = require("../models/units");

const poCategoryModel = require("../models/poCategory")
const actionLogModel = require("../models/actionLog");

const poCategoryService = {
    listPoCategories:async(params)=>{
        try{
            const poCategories = poCategoryModel.findAllPoCategory(params)
            return poCategories
        }catch(err){
            return Promise.reject(err)
        }
    },
    getPoCategory:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    createPoCategory:async(poCategoryData,currentUserName, currentUserId)=>{
        try{
            const id = await poCategoryModel.createPoCategory(poCategoryData)
            const actionLogData = {
                relatedUserId:currentUserId,
                actionType:"Create Product Category",
                actionSubject:`Create Product Category by  ${currentUserName}`,
                actionContent:JSON.stringify({
                    id,
                    ...poCategoryData
                })
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updatePoCategory:async(poCategoryData,currentUserName, currentUserId)=>{
        const {poCategoryId, data} = poCategoryData
        try{
            const findPoCategory  = await poCategoryModel.findPoCategoryById(poCategoryId)
            if(isEmpty(findPoCategory)){
                const err = createError(400, `id ${poCategoryId} does not exist.!`)
                throw err
            }
            await  poCategoryModel.updatePoCategoryById(poCategoryId, data)
            const actionLogData = {
                relatedUserId:currentUserId,
                actionType:"Updated Product Category",
                actionSubject:`Updated Product Category by  ${currentUserName}`,
                actionContent:JSON.stringify(poCategoryData)
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deletePoCategory:async(poCategoryId,currentUserName, currentUserId )=>{
        try{
            const findPoCategory  = await poCategoryModel.findPoCategoryById(poCategoryId)
            if(isEmpty(findPoCategory)){
                const err = createError(400, `id ${poCategoryId} does not exist.!`)
                throw err
            }
            await poCategoryModel.updatePoCategoryById(poCategoryId,{isDeleted:true})
            const actionLogData = {
                relatedUserId:currentUserId,
                actionType:"Deleted Product Category",
                actionSubject:`Deleted Product Category by  ${currentUserName}`,
                actionContent:null
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },

}
module.exports = poCategoryService
