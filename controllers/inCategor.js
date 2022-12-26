const createError = require("http-errors")

const inCategoryService = require("../services/inCategory")
const {isGuidValid} = require("../utils");

const inCategoryController = {
    listInCategory:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const inCategories = await inCategoryService.listInCategory(requestParams)
            res.status(200).json({ success: true, message: "Get All Ingredient Categories", inCategories })

        }catch(err){
            next(err)
        }
    },
    getInCategoryById:async(req, res, next)=>{
        const inCategoryId =  req.params.inCategoryId
        if (!isGuidValid(inCategoryId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            const inCategory = await inCategoryService.getInCategory(inCategoryId)
            res.status(200).json({ success: true, message: "Get Ingredient Categories", inCategory })
        }catch(err){
            next(err)
        }
    },
    createInCategory: async(req, res, next)=>{
        const {name} =  req.body
        if(![name].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
         await inCategoryService.createInCategory(req.body,req.user.currentUserName,
             req.user.userId )
            res.status(201).json({ success: true, message: "Created Ingredient Categories" })
        }catch(err){
            next(err)
        }
    },
    updateInCategory: async(req, res, next)=>{
        const inCategoryId = req.params.inCategoryId
        const {name} = req.body
        if (!isGuidValid(inCategoryId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        if(![name].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await inCategoryService.updateInCategory({inCategoryId, data: req.body},req.user.currentUserName,
                req.user.userId )
            res.status(200).json({ success: true, message: "Updated Ingredient Categories" })
        }catch(err){
            next(err)
        }
    },
    deleteInCategory: async(req, res, next) => {
        const inCategoryId = req.params.inCategoryId
        if (!isGuidValid(inCategoryId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await inCategoryService.deleteInCategory(inCategoryId,req.user.currentUserName,
                req.user.userId )
            res.status(200).json({ success: true, message: "Ingredient category deleted" })

        }catch(err){
            next(err)
        }

    }

}

module.exports = inCategoryController
