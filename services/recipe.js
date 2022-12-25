const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")

const recipeModel = require("../models/recipe")
const ingredientService = require("./ingredient");
const productService = require("../services/product")
const actionLogModel = require("../models/actionLog");
const recipeService = {
    listAllRecipeByPoId:async(productId, requestParams) => {
        try {
            const recipe = await recipeModel.findRecipeByProductId(productId, requestParams)
            return recipe
        }catch(err){
            return Promise.reject(err)
        }
    },
    createRecipe: async (productId,recipeDTO, currentUserName, currentUserId) => {
        const { ingredientId} = recipeDTO
        try{
            await ingredientService.getIngredient(ingredientId)
            const findProduct = await productService.getProduct(productId)
            const newData = {
                ...recipeDTO,
                productId,
                createdBy:currentUserId
            }
            const {id} = await recipeModel.createRecipe(newData)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create recipe",
                actionSubject: `Create ${findProduct.name} recipe by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id,
                    ...recipeDTO,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateRecipeById: async(recipeDTO, currentUserName, currentUserId) => {
        const {recipeId, data} = recipeDTO
        const {productId, ingredientId} = data
        try{
            const findRecipe = await recipeModel.findRecipeById(recipeId)
            if(isEmpty(findRecipe)){
                const err = createError(400, `Recipe with id ${recipeId} does not exist.!`)
                throw err
            }
            const findIngredient = await ingredientService.getIngredient(ingredientId)
            const findProduct = await productService.getProduct(productId)
            const updateData = {
                productId:findProduct.id,
                ingredientId:findIngredient.id,
                quantity: data.quantity
            }
            await recipeModel.updateRecipeById(recipeId, updateData)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated recipe",
                actionSubject: `Updated ${findProduct.name} recipe by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id:recipeId,
                    ...updateData,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteRecipeById: async (recipeId,currentUserName, currentUserId ) => {
        try{
            const findRecipe = await recipeModel.findRecipeById(recipeId)
            if(isEmpty(findRecipe)){
                const err = createError(400, `Recipe with id ${recipeId} does not exist.!`)
                throw err
            }
            await recipeModel.updateRecipeById(recipeId,{isDeleted: true} )
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted recipe",
                actionSubject: `Deleted recipe by ${currentUserName}`,
                actionContent: JSON.stringify(recipeId),
            }
            await actionLogModel.createActionLog(actionLogData)

        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = recipeService