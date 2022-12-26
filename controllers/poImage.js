const createError = require("http-errors")

const poImageService = require("../services/poImage")
const {isGuidValid} = require("../utils");

const poImageController = {
    listAllImages:async(req, res, next)=>{
        const requestParams = req.query
        try{
            const images = await poImageService.listAllPoImage(requestParams)
            res.status(200).json({ success: true, message: "Get All Product Images", images })
        }catch(err){
            next(err)
        }
    },
    listImgByPoId:async(req, res, next)=>{
        const productId =  req.params.productId
        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            const images = await poImageService.listImgByPoId(productId)
            res.status(200).json({ success: true, message: "Get Product Images", images })
        }catch(err){
            next(err)
        }
    },
    createProduct:async(req, res, next) => {
        const { productId,imageUrl} = req.body
        if(![productId,imageUrl].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        if (!isGuidValid(productId)) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try{
            await poImageService.createPoImage(req.body,req.user.currentUserName,
                req.user.userId)
            res.status(201).json({ success: true, message: "Product Image created" })
        }catch(err){
            next(err)
        }
    },
    updatePoImage:async(req, res, next) => {
        const poImageId = req.params.poImageId
        const { productId,imageUrl} = req.body
        if(![productId,imageUrl].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        if (!isGuidValid(productId) ||!isGuidValid(poImageId)  ) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }
        try {
            await poImageService.updatePoImage({poImageId, data:req.body},req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product Image Updated" })
        }catch(err){
            next(err)
        }
    },
    deletePoImage: async(req, res, next) => {
        const poImageId = req.params.poImageId
        if (!isGuidValid(poImageId)  ) {
            const error = createError(400, "Invalid id.")
            return next(error)
        }

        try{
            await poImageService.deletePoImage(poImageId, req.user.currentUserName,
                req.user.userId)
            res.status(200).json({ success: true, message: "Product Image Deleted." })
        }catch (err) {
            next(err)
        }
    }
}

module.exports = poImageController
