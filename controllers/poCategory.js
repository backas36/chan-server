const createError = require("http-errors")

const poCategoryService = require("../services/poCategory")
const {isGuidValid} = require("../utils");
const productService = require("../services/product");

const poCategoryController ={
    listProducts:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const products = await poCategoryService.listPoCategory(requestParams)
            res.status(200).json({ success: true, message: "Get All Product Categories", products })
        }catch(err){
            next(err)
        }
    },
    getPoCategoryById:async(req,res,next)=>{
        const poCategoryId =  req.params.poCategoryId
        if (!isGuidValid(poCategoryId)) {
            const error = createError(400, "Invalid user id.")
            return next(error)
        }
        try{
            const poCategory = await poCategoryService.getPoCategoryById(poCategoryId)
            res.status(200).json({ success: true, message: "Get Product Category", poCategory })
        }catch(err){
            next(err)

        }
    },
    createPoCategory: async(req, res, next)=>{
        const {name} = req.body
        if(![name].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await poCategoryService.createPoCategory(req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({ success: true, message: "Product category created" })
        }catch(err){
            next(err)
        }
    },
    updatePoCategory: async(req, res, next)=>{
        const poCategoryId = req.params.poCategoryId
        const {name} = req.body

        if (!isGuidValid(poCategoryId)) {
            const error = createError(400, "Invalid user id.")
            return next(error)
        }

        if(![name].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await poCategoryService.updatePoCategory({poCategoryId, data:req.body}, req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product category updated" })
        }catch(err){
            next(err)
        }
    },
    deletePoCategory: async(req, res, next)=>{
        const poCategoryId = req.params.poCategoryId
        if (!isGuidValid(poCategoryId)) {
            const error = createError(400, "Invalid user id.")
            return next(error)
        }
        try{
            await poCategoryService.deletePoCategory(poCategoryId,  req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product category deleted" })
        }catch(err){
            next(err)
        }
    }
}

module.exports = poCategoryController
