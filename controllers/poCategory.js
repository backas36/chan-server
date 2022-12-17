const createError = require("http-errors")

const poCategoryService = require("../services/poCategory")
const {isGuidValid} = require("../utils");

const poCategoryController = {
    listPoCategories:async(req,res, next)=>{
        const requestParams = req.query
        try{
            const poCategories = await poCategoryService.listPoCategories(requestParams)
            res.status(200).json({ success: true, message: "Get All product categories", poCategories })
        }catch(err){
            next(err)
        }
    },
    getPoCategory:async(req,res, next)=>{
        // const {name, unit, base} = req.body
        //
        // if(![name, unit, base].every(Boolean)){
        //     const error = createError(400, "Please enter fields completely.")
        //     return next(error)
        // }
        //
        // try{
        //     await unitService.createUnit(req.body, req.user.userId)
        //     res.status(201).json({success:true, message:"Unit created"})
        // }catch(err){
        //     next(err)
        // }
    },
    createPoCategory:async(req,res, next)=>{
            const {name, createdBy} = req.body

            if(![name, createdBy].every(Boolean)){
                const error = createError(400, "Please enter fields completely.")
                return next(error)
            }
            try{
                await poCategoryService.createPoCategory(req.body, req.user.currentUserName,
                    req.user.userId)
                res.status(201).json({success:true, message:"Product Category created"})
            }catch(err){
                next(err)
            }
    },
    updatePoCategory:async(req,res, next)=>{
            const poCategoryId = req.params.poCategoryId
            const {name, createdBy} = req.body
            if (!isGuidValid(poCategoryId)) {
                const error = createError(400, "Invalid  id.")
                return next(error)
            }
            if(![name, createdBy].every(Boolean)){
                const error = createError(400, "Please enter fields completely.")
                return next(error)
            }
            try{
                await poCategoryService.updatePoCategory({poCategoryId, data:req.body },req.user.currentUserName,
                    req.user.userId)
                res.status(200).json({ success: true, message: "Product Category Updated" })
            }catch(err){
                next(err)
            }
    },
    deletePoCategory:async(req,res, next)=>{
            const poCategoryId = req.params.poCategoryId
            if (!isGuidValid(poCategoryId)) {
                const error = createError(400, "Invalid  id.")
                return next(error)
            }
            try{
                await poCategoryService.deletePoCategory(poCategoryId,req.user.currentUserName,  req.user.userId)
                res.status(200).json({ success: true, message: "Product Category Deleted." })
            }catch(err){
                next(err)
            }
    }
}

module.exports = poCategoryController
