const createError = require("http-errors")

const supplierService = require("../services/supplier")

const {isGuidValid} = require("../utils");

const supplierController = {
    listSuppliers:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const suppliers = await supplierService.listSuppliers(requestParams)
            res.status(200).json({ success: true, message: "Get All Suppliers", suppliers })

        }catch(err){
            next(err)
        }
    },
    getSupplierById:async(req, res, next)=>{
        const supplierId =  req.params.supplierId
        if (!isGuidValid(supplierId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            const supplier = await supplierService.getSupplier(supplierId)
            res.status(200).json({ success: true, message: "Get supplier", supplier })
        }catch(err){
            next(err)
        }
    },
    createSupplier: async(req, res, next)=>{
        const {name, type} =  req.body
        if(![name, type].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await supplierService.createSupplier(req.body,req.user.currentUserName,
                req.user.userId )
            res.status(201).json({ success: true, message: "Created Supplier" })
        }catch(err){
            next(err)
        }
    },
    updateSupplier: async(req, res, next)=>{
        const supplierId = req.params.supplierId
        const {name, type} = req.body
        if (!isGuidValid(supplierId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        if(![name, type].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await supplierService.updateSupplier({supplierId, data: req.body},req.user.currentUserName,
                req.user.userId )
            res.status(200).json({ success: true, message: "Updated Supplier" })
        }catch(err){
            next(err)
        }
    },
    deleteSupplier: async(req, res, next) => {
        const supplierId = req.params.supplierId
        if (!isGuidValid(supplierId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await supplierService.deleteSupplier(supplierId,req.user.currentUserName,
                req.user.userId )
            res.status(200).json({ success: true, message: "Supplier deleted" })

        }catch(err){
            next(err)
        }

    }
}

module.exports = supplierController
