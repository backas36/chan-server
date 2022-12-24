const createError = require("http-errors")

const productService = require("../services/product")
const {isGuidValid} = require("../utils");

const productController = {
    listProducts:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const products = await productService.listProducts(requestParams)
            res.status(200).json({ success: true, message: "Get All Products", products })
        }catch(err){
            next(err)
        }
    },
    getProduct:async(req, res, next)=>{
        const productId =  req.params.productId
        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            const product = await productService.getProduct(productId)
            res.status(200).json({ success: true, message: "Get Product Info", product })
        }catch(err){
            next(err)
        }
    },
    createProduct:async(req, res, next)=>{
        const {name, fixedPrice, sku, category, variant} = req.body
        if(![name, fixedPrice, sku, category, variant].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        try{
            await productService.createProduct(req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({ success: true, message: "Product created" })
        }catch(err){
            next(err)
        }
    },
    updateProduct:async(req, res, next)=>{
        const productId = req.params.productId
        const {name, fixedPrice, sku, category,variant} = req.body

        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        if(![name, fixedPrice, sku, category,variant].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }

        try{
            await productService.updateProduct({productId, data:req.body},req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product Updated" })
        }catch(err){
            next(err)
        }
    },
    deleteProduct:async(req, res, next)=>{
        const productId =  req.params.productId
        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await productService.deleteProduct(productId,req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product Deleted." })

        }catch(err){
            next(err)
        }
    },
}

module.exports = productController
