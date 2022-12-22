const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const purchaseModel = require("../models/purchase")
const supplierService = require("../services/supplier")
const actionLogModel = require("../models/actionLog");
const ingredientService = require("../services/ingredient")

const skipKeys = ["supplierName", "supplierType","location","supplierContact",
    "ingredientName", "ingredientBrand", "ingredientUnit", "ingredientSize", "ingredientSku",
    "ingredientDesc", "categoryName", "isNew"]

const purchaseService = {
    listAllPurchase:async(requestParams)=>{
        try{
            const purchases = await purchaseModel.findAllPurchase(requestParams)
            return  purchases
        }catch(err){
            return Promise.reject(err)
        }
    },
    getPurchase:async(purchaseId)=>{
        try{
            const findPurchase = await purchaseModel.findPurchaseById(purchaseId)

            if(isEmpty(findPurchase)){
                const err = createError(400, `Purchase with id ${purchaseId} does not exist.!`)
                throw err
            }
            return findPurchase
        }catch(err){
            return Promise.reject(err)
        }
    },
    createPurchase:async (purchaseDTO, currentUserName, currentUserId ) => {
        const {ingredientId,supplierId, ...newPurchase } = purchaseDTO

        try{
             await  supplierService.getSupplier(supplierId)
            const findIngredient = await ingredientService.getIngredient(ingredientId)

            const newData = {
                supplierId,
                ingredientId:findIngredient.id,
                createdBy:currentUserId,
                ...(omit(newPurchase, skipKeys))
            }


            const {id} = await purchaseModel.createPurchase(newData)

            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create purchase",
                actionSubject: `Create purchase by ${currentUserName}`,
                actionContent: JSON.stringify({
                    id,
                    ...newData,
                }),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updatePurchase:async(purchaseDTO, currentUserName, currentUserId) => {
        const {purchaseId, data } = purchaseDTO
        const {ingredientId,supplierId} = data
        try{
            const findPurchase = await purchaseModel.findPurchaseById(purchaseId)
            if(isEmpty(findPurchase)){
                const err = createError(400, `Purchase with id ${purchaseId} does not exist.!`)
                throw err
            }

            await  supplierService.getSupplier(supplierId)
            const findIngredient = await ingredientService.getIngredient(ingredientId)

            const updateData = {
                supplierId,
                ingredientId:findIngredient.id,
                ...(omit(data, skipKeys))
            }
            await purchaseModel.updatePurchase(purchaseId,updateData)

            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated purchase",
                actionSubject: `Updated purchase by ${currentUserName}`,
                actionContent: JSON.stringify(updateData),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deletePurchase:async(purchaseId, currentUserName, currentUserId) => {
        try{
            const findPurchase = await purchaseModel.findPurchaseById(purchaseId)
            if(isEmpty(findPurchase)){
                const err = createError(400, `Purchase with id ${purchaseId} does not exist.!`)
                throw err
            }

            await purchaseModel.updatePurchase(purchaseId,{isDeleted: true})

            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted purchase",
                actionSubject: `Deleted purchase by ${currentUserName}`,
                actionContent: JSON.stringify(purchaseId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    }
}

module.exports = purchaseService