const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")
const poCategoryModel = require("../models/poCategory");
const actionLogModel = require("../models/actionLog");

const poCategoryService ={
    findPoCategoryByName:async(categoryName,currentUserName, currentUserId)=>{
        let categoryId
        try{
            const [findPoCategory] = await poCategoryModel.findPoCategoryByName(categoryName)
            if(isEmpty(findPoCategory)){
                const {id} = await poCategoryModel.createPoCategory({name:categoryName})
                categoryId = id

                const actionLogData = {
                    relatedUserId: currentUserId,
                    actionType: "Create product category",
                    actionSubject: `Create  product category by ${currentUserName}`,
                    actionContent: JSON.stringify({id, name:categoryName}),
                }
                await actionLogModel.createActionLog(actionLogData)
            }else{
                categoryId = findPoCategory.id
            }
            return categoryId
        }catch(err){
            return Promise.reject(err)
        }
    },
    listPoCategory:async(requestParams)=>{
        try{
            const poCategories = await poCategoryModel.findAllPoCategory(requestParams)
            return  poCategories
        }catch(err){
            return Promise.reject(err)
        }
    },
    getPoCategoryById:async(poCategoryId)=>{
        try{
            const findPoCategory = await poCategoryModel.findPoCategoryById(poCategoryId)
            if(isEmpty(findPoCategory)){
                const err = createError(400, `Product Category with id ${poCategoryId} does not exist.!`)
                throw err
            }
            return findPoCategory
        }catch(err){
            return Promise.reject(err)

        }
    },
    createPoCategory:async(poCategoryDTO, currentUserName, currentUserId) => {
        try{
            const {id} = await poCategoryModel.createPoCategory(poCategoryDTO)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create product category",
                actionSubject: `Create  product category by ${currentUserName}`,
                actionContent: JSON.stringify({id, ...poCategoryDTO}),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch (err){
            return Promise.reject(err)
        }
    },
    updatePoCategory:async(poCategoryDTO, currentUserName, currentUserId)=>{
        const {poCategoryId, data}= poCategoryDTO
        try{
            const findPoCategory = await poCategoryModel.findPoCategoryById(poCategoryId)
            if(isEmpty(findPoCategory)){
                const err = createError(400, `Product with id ${poCategoryId} does not exist.!`)
                throw err
            }
            await poCategoryModel.updatePoCategoryById(poCategoryId,data)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated product category",
                actionSubject: `Updated  product category by ${currentUserName}`,
                actionContent: JSON.stringify(poCategoryDTO),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deletePoCategory:async(poCategoryId, currentUserName, currentUserId)=>{
        try{
            const findPoCategory = await poCategoryModel.findPoCategoryById(poCategoryId)
            if(isEmpty(findPoCategory)){
                const err = createError(400, `Product with id ${poCategoryId} does not exist.!`)
                throw err
            }
            await poCategoryModel.updatePoCategoryById(poCategoryId, {isDeleted:true})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted product category",
                actionSubject: `Deleted  product category by ${currentUserName}`,
                actionContent: JSON.stringify(poCategoryId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = poCategoryService
