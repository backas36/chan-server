const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")

const inCategoryModel = require("../models/inCategory")
const actionLogModel = require("../models/actionLog");

const inCategoryService ={
    findInCategoryByName:async(categoryName,currentUserName, currentUserId)=>{
        let categoryId
        try{
            const [findInCategory] = await inCategoryModel.findInCategoryByName(categoryName)
            if(isEmpty(findInCategory)){
                const {id} = await inCategoryModel.createInCategory({name:categoryName})
                categoryId = id
                const actionLogData = {
                    relatedUserId: currentUserId,
                    actionType: "Create inventory category",
                    actionSubject: `Create  inventory category by ${currentUserName}`,
                    actionContent: JSON.stringify({id, name:categoryName}),
                }
                await actionLogModel.createActionLog(actionLogData)
            }else{
                categoryId = findInCategory.id
            }
            return categoryId
        }catch(err){
            return Promise.reject(err)
        }
    },
    listInCategory:async(requestParams)=>{
        try{
            const inCategories = await inCategoryModel.findAllInCategory(requestParams)
            return  inCategories
        }catch(err){
            return Promise.reject(err)
        }
    },
    getInCategory:async(inCategoryId)=>{
        try{
            const findInCategory = await inCategoryModel.findInCategory(inCategoryId)
            if(isEmpty(findInCategory)){
                const err = createError(400, `Ingredient Category with id ${inCategoryId} does not exist.!`)
                throw err
            }
            return  findInCategory
        }catch(err){
            return Promise.reject(err)
        }
    },
    createInCategory:async(inCategoryDTO,currentUserName, currentUserId)=>{
        try{
            const {id} = await inCategoryModel.createInCategory(inCategoryDTO)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create ingredient category",
                actionSubject: `Create  ingredient category by ${currentUserName}`,
                actionContent: JSON.stringify({id, ...inCategoryDTO}),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateInCategory:async(inCategoryDTO,currentUserName, currentUserId)=>{
        const {inCategoryId, data}= inCategoryDTO

        try{
           const findInCategory = await  inCategoryModel.findInCategory(inCategoryId)
            if(isEmpty(findInCategory)){
                const err = createError(400, `Product with id ${inCategoryId} does not exist.!`)
                throw err
            }

            await inCategoryModel.updateInCategoryById(inCategoryId, data)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated ingredient category",
                actionSubject: `Updated  ingredient category by ${currentUserName}`,
                actionContent: JSON.stringify(inCategoryDTO),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteInCategory: async(inCategoryId,currentUserName, currentUserId) =>{
        try{
            const findInCategory = await  inCategoryModel.findInCategory(inCategoryId)
            if(isEmpty(findInCategory)){
                const err = createError(400, `Ingredient Category with id ${inCategoryId} does not exist.!`)
                throw err
            }

            await inCategoryModel.updateInCategoryById(inCategoryId, {isDeleted:true})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted ingredient category",
                actionSubject: `Deleted  ingredient category by ${currentUserName}`,
                actionContent: JSON.stringify(inCategoryId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    }
}

module.exports = inCategoryService

