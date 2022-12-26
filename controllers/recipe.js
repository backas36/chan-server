const createError = require("http-errors")

const productService = require("../services/product")
const recipeService = require("../services/recipe")
const {isGuidValid} = require("../utils");

const recipeController = {
    listAllRecipeByPoId: async(req, res, next) => {
        const requestParams = req.query
        const productId = req.params.productId
        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            const findProduct = await productService.getProduct(productId)
            const recipe = await recipeService.listAllRecipeByPoId(productId, requestParams)
            res.status(200).json({success:true, message:`Get All Recipe by product name : ${findProduct.name}`, recipe})
        }catch(err){
            next(err)
        }
    },
    createRecipe: async(req, res, next) => {
        const productId = req.params.productId
        const {quantity, ingredientId} = req.body

        if(![quantity, ingredientId].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }

        if (!isGuidValid(productId) || !isGuidValid(ingredientId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        try{
            await recipeService.createRecipe(productId,req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({success:true, message:"Recipe Created"})
        }catch(err){
            next(err)
        }
    },
    updateRecipeById : async(req, res, next) => {
        const recipeId = req.params.recipeId
        const {quantity, ingredientId, productId} = req.body

        if(![quantity, ingredientId, productId].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }

        if (!isGuidValid(productId) || !isGuidValid(ingredientId) || !isGuidValid(recipeId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await recipeService.updateRecipeById({recipeId,data:req.body},req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Recipe Updated" })

        }catch(err){
            next(err)
        }
    },
    deleteRecipeById : async(req, res, next) => {
        const recipeId = req.params.recipeId
        if(!isGuidValid(recipeId)){
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await recipeService.deleteRecipeById(recipeId,req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Recipe Deleted" })
        }catch(err){
            next(err)
        }
    }
}

module.exports = recipeController

