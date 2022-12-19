const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const poImageModel = require("../models/poImage")
const productModel = require("../models/product")
const poCategoryService = require("./poCategory");
const actionLogModel = require("../models/actionLog");


const poImageService = {
    listAllPoImage:async(requestParams)=>{
        try{
            const images = await poImageModel.findAllPoImg(requestParams)
            return  images
        }catch(err){
            return Promise.reject(err)
        }
    },
    listImgByPoId:async(productId)=>{
        try{
            const findPoImages = await poImageModel.findPoImgByPoId(productId)

            return findPoImages
        }catch(err){
            return Promise.reject(err)
        }
    },
    createPoImage:async(imgDTO, currentUserName, currentUserId)=>{
        const {productId,imageUrl} = imgDTO
        try{
            const findProduct = await productModel.findProductById(productId)
            if(isEmpty(findProduct)){
                const err = createError(400, `Product with id ${productId} does not exist.!`)
                throw err
            }
            const {id} = await  poImageModel.createPoImage({productId,imageUrl})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create product image",
                actionSubject: `Create product image by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id,
                    ...imgDTO,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updatePoImage:async(imgDTO, currentUserName, currentUserId)=>{
        const {poImageId,data} = imgDTO
        const {productId,imageUrl} = data
        try{
            const findProduct = await productModel.findProductById(productId)

            const findImage = await poImageModel.findPoImageByImgId(poImageId)
            if(isEmpty(findProduct) || isEmpty(findImage)){
                const err = createError(400, `Product or Image with id does not exist.!`)
                throw err
            }
          await  poImageModel.updatePoImageByImgId(poImageId,{productId,imageUrl})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated product image",
                actionSubject: `Updated product image by ${currentUserName}`,
                actionContent: JSON.stringify(data),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deletePoImage: async(poImageId, currentUserName, currentUserId) => {
        try{
            const findImage = await poImageModel.findPoImageByImgId(poImageId)
            if(isEmpty(findImage)){
                const err = createError(400, `Product or Image with id does not exist.!`)
                throw err
            }
            await poImageModel.updatePoImageByImgId(poImageId,{isDeleted: true})

            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted product image",
                actionSubject: `Deleted product image by ${currentUserName}`,
                actionContent: JSON.stringify(poImageId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
}

module.exports = poImageService