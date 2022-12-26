const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const ingredientModel = require("../models/ingredient")
const inCategoryService = require("../services/inCategory")
const actionLogModel = require("../models/actionLog");

const ingredientService = {
    listIngredients:async(requestParams) => {
        try{
            const ingredients = await ingredientModel.findAllIngredient(requestParams)
            return ingredients
        }catch(err){
            return Promise.reject(err)
        }
    },
    getIngredient:async(ingredientId) => {
        try{
            const findIngredient = await ingredientModel.findIngredientById(ingredientId)
            if(isEmpty(findIngredient)){
                const err = createError(400, `Ingredient with id ${ingredientId} does not exist.!`)
                throw err
            }
            return  findIngredient
        }catch(err){
            return Promise.reject(err)
        }
    },
    createIngredient:async(ingredientDTO,currentUserName, currentUserId) => {
        const {category, ...newIngredient} = ingredientDTO
        try{
            const inCategoryId = await inCategoryService.findInCategoryByName(category,currentUserName, currentUserId)
            const {id} = await ingredientModel.createIngredient({
                ingredientCategoryId:inCategoryId,
                ...newIngredient
            })
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create ingredient",
                actionSubject: `Create ingredient by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id,
                    ...newIngredient,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateIngredient:async(ingredientDTO,currentUserName, currentUserId) => {
        const {ingredientId, data} = ingredientDTO
        const {category} = data
        try{
            const findIngredient = await ingredientModel.findIngredientById(ingredientId)
            if(isEmpty(findIngredient)){
                const err = createError(400, `ingredient with id ${ingredientId} does not exist.!`)
                throw err
            }
            const inCategoryId = await inCategoryService.findInCategoryByName(category,currentUserName, currentUserId)
            const newData = {
                ...omit(data, ['category','isNew']),
                ingredientCategoryId:inCategoryId,
            }
            await ingredientModel.updateIngredientById(ingredientId, newData)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated ingredient",
                actionSubject: `Updated ingredient by ${currentUserName}`,
                actionContent: JSON.stringify(newData),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteIngredient:async(ingredientId,currentUserName, currentUserId  ) => {
        try{
            const findIngredient = await ingredientModel.findIngredientById(ingredientId)
            if(isEmpty(findIngredient)){
                const err = createError(400, `ingredient with id ${ingredientId} does not exist.!`)
                throw err
            }
            await ingredientModel.updateIngredientById(ingredientId,{isDeleted: true})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: 'Delete ingredient',
                actionSubject: `Delete ingredient by ${currentUserName}`,
                actionContent: JSON.stringify(ingredientId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = ingredientService


/*

async() => {
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },

 */