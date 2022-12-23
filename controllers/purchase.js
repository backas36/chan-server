const createError = require("http-errors")

const {isGuidValid} = require("../utils");
const purchaseService = require("../services/purchase")

const purchaseController = {
    listAllPurchase:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const purchases = await purchaseService.listAllPurchase(requestParams)
            res.status(200).json({ success: true, message: "Get All Purchases", purchases })
        }catch(err){
            next(err)
        }
    },
    getPurchase:async(req, res, next)=>{
        const purchaseId =  req.params.purchaseId
        if (!isGuidValid(purchaseId)) {
            const error = createError(400, "Invalid user id.")
            return next(error)
        }
        try{
            const purchase = await purchaseService.getPurchase(purchaseId)
            res.status(200).json({ success: true, message: "Get Purchase Info", purchase })
        }catch(err){
            next(err)
        }
    },
createPurchase:async(req, res, next) => {
        const {quantity, purchaseDate, unitPrice, purchasePrice, brand ,supplierId, ingredientId} = req.body
        if (!isGuidValid(ingredientId) || !isGuidValid(supplierId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        if(![quantity, purchaseDate, unitPrice, purchasePrice,supplierId, ingredientId,brand].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await purchaseService.createPurchase(req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({ success: true, message: "Purchase created" })
        }catch(err){
            next(err)
        }
    },
    updatePurchase:async(req, res, next) => {
        const purchaseId = req.params.purchaseId
        const {quantity, purchaseDate, unitPrice, purchasePrice,supplierId, ingredientId,brand} = req.body

        if (!isGuidValid(purchaseId) || !isGuidValid(ingredientId) || !isGuidValid(supplierId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        if(![quantity, purchaseDate, unitPrice, purchasePrice,supplierId, ingredientId,brand].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await purchaseService.updatePurchase({purchaseId, data:req.body}, req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Purchase Updated" })
        }catch(err){
            next(err)
        }
    },
    deletedPurchase: async(req, res, next) => {
        const purchaseId = req.params.purchaseId

        if (!isGuidValid(purchaseId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        try{
            await purchaseService.deletePurchase(purchaseId, req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Purchase Deleted" })
        }catch(err){
            next(err)
        }
    },

}

module.exports = purchaseController