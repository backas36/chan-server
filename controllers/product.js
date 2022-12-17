const createError = require("http-errors")

const productService = require("../services/product")

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
        try{

        }catch(err){
            next(err)
        }
    },
    createProduct:async(req, res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    },
    updateProduct:async(req, res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    },
    deleteProduct:async(req, res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    },
}

module.exports = productController
