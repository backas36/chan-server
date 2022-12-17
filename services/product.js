const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")

const productModel = require("../models/product")
const productService = {
    listProducts:async(requestParams)=>{
        try{
            const products = await productModel.findAllProduct(requestParams)
            return  products
        }catch(err){
            return Promise.reject(err)
        }
    },
    getProduct:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    createProduct:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    updateProduct:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteProduct:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = productService
