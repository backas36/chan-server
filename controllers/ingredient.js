const createError = require("http-errors")

const ingredientService = require("../services/ingredient")
const {isGuidValid} = require("../utils");

const ingredientController = {
    listIngredients: async(req,res,next) => {
        const requestParams = req.query
        try{
            const ingredients = await ingredientService.listIngredients(requestParams)
            res.status(200).json({ success: true, message: "Get All Products", ingredients })
        }catch(err){
            next(err)
        }
    },
    getIngredient:async(req,res,next) => {
        const ingredientId = req.params.ingredientId

        if (!isGuidValid(ingredientId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        try{
            const ingredient = await ingredientService.getIngredient(ingredientId)
            res.status(200).json({ success: true, message: "Get Ingredient Info", ingredient })
        }catch(err){
            next(err)
        }
    },
    createIngredient:async(req,res,next) => {
        const {name, category, sku} = req.body
        if(![name, category, sku,].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await ingredientService.createIngredient(req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({ success: true, message: "Ingredient created" })
        }catch(err){
            next(err)
        }
    },
    updateInventory:async(req,res,next) => {
        const ingredientId = req.params.ingredientId
        const {name, category, sku} = req.body
        if (!isGuidValid(ingredientId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        if(![name, category, sku].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await ingredientService.updateIngredient({ingredientId, data:req.body},req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Ingredient Updated" })

        }catch(err){
            next(err)
        }
    },
    deleteIngredient:async(req,res,next) => {
        const ingredientId = req.params.ingredientId
        if (!isGuidValid(ingredientId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await ingredientService.deleteIngredient(ingredientId,req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Ingredient Deleted." })

        }catch(err){
            next(err)
        }
    },
}


module.exports = ingredientController
