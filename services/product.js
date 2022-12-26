const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const poCategoryService = require("../services/poCategory")

const productModel = require("../models/product")
const actionLogModel = require("../models/actionLog");

const productService = {
    listProducts:async(requestParams)=>{
        try{
            const products = await productModel.findAllProduct(requestParams)
            return  products
        }catch(err){
            return Promise.reject(err)
        }
    },
    getProduct:async(productId)=>{
        try{
            const findProduct = await productModel.findProductById(productId)

            if(isEmpty(findProduct)){
                const err = createError(400, `Product with id ${productId} does not exist.!`)
                throw err
            }
            return findProduct
        }catch(err){
            return Promise.reject(err)
        }
    },
    createProduct:async(productDTO, currentUserName, currentUserId)=>{
        const {name,category,...newProduct} = productDTO
        try{
            const findProduct = await productModel.findProductByName(name)
            if(!isEmpty(findProduct)){
                const err = createError(409, "Product with name is already exists.")
                throw err
            }
            const categoryId = await poCategoryService.findPoCategoryByName(category,currentUserName, currentUserId)
            const {id} = await  productModel.createProduct({
                name,
                poCategoryId:categoryId,
                ...newProduct})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create product",
                actionSubject: `Create product by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id,
                    ...productDTO,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateProduct:async(productDTO,currentUserName, currentUserId )=>{
        const {productId, data} = productDTO
        try{
            const findProduct = await productModel.findProductById(productId)

            if(isEmpty(findProduct)){
                const err = createError(400, `Product with id ${productId} does not exist.!`)
                throw err
            }

            const categoryId = await poCategoryService.findPoCategoryByName(data.category,currentUserName, currentUserId)

            const newData = {...omit(data, ["category"]),poCategoryId:categoryId}

            await productModel.updateProductById(productId, newData)

            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated product",
                actionSubject: `Updated product by ${currentUserName}`,
                actionContent: JSON.stringify(newData),
            }
            await actionLogModel.createActionLog(actionLogData)

        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteProduct:async(productId,currentUserName, currentUserId )=>{
        try{
            const findProduct = await productModel.findProductById(productId)

            if(isEmpty(findProduct)){
                const err = createError(400, `Product with id ${productId} does not exist.!`)
                throw err
            }

            await productModel.updateProductById(productId,{isDeleted: true})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: 'Delete Product',
                actionSubject: `Delete Product by ${currentUserName}`,
                actionContent: JSON.stringify(productId),
            }
            await actionLogModel.createActionLog(actionLogData)
            return
        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = productService
