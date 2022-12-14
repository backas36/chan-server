const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")


const supplierModel = require("../models/supplier")
const actionLogModel = require("../models/actionLog");

const supplierService ={
    findSupplier:async(supplierData,currentUserName, currentUserId)=>{
        const data = {name:supplierData.supplierName, type:supplierData.supplierType}
        let supplierId
        try{
            const [findSupplier] = await supplierModel.finSupplierByName(data)
            if(isEmpty(findSupplier)){
                const {id} = await supplierModel.createSupplier(data)
                supplierId = id

                const actionLogData = {
                    relatedUserId: currentUserId,
                    actionType: "Create supplier",
                    actionSubject: `Create supplier by ${currentUserName}`,
                    actionContent: JSON.stringify({id, ...data}),
                }
                await actionLogModel.createActionLog(actionLogData)
            }else{
                supplierId = findSupplier.id
            }
            return supplierId
        }catch(err){
            return Promise.reject(err)
        }
    },
    listSuppliers:async(requestParams)=>{
        try{
            const suppliers = await supplierModel.findAllSuppliers(requestParams)
            return  suppliers
        }catch(err){
            return Promise.reject(err)
        }
    },
    getSupplier:async(supplierId)=>{
        try{
            const findSupplier = await supplierModel.findSupplierById(supplierId)
            if(isEmpty(findSupplier)){
                const err = createError(400, `Supplier with id ${supplierId} does not exist.!`)
                throw err
            }
            return  findSupplier
        }catch(err){
            return Promise.reject(err)
        }
    },
    createSupplier:async(supplierDTO,currentUserName, currentUserId)=>{
        try{
            const {id} = await supplierModel.createSupplier(supplierDTO)
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Create supplier",
                actionSubject: `Create supplier by ${currentUserName}`,
                actionContent: JSON.stringify({id, ...supplierDTO}),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    updateSupplier:async(supplierDTO,currentUserName, currentUserId)=>{
        const {supplierId, data}= supplierDTO

        try{
            const findSupplier = await  supplierModel.findSupplierById(supplierId)
            if(isEmpty(findSupplier)){
                const err = createError(400, `Supplier with id ${supplierId} does not exist.!`)
                throw err
            }

            await supplierModel.updateSupplier(supplierId, omit(data, ["isNew"]))
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Updated supplier",
                actionSubject: `Updated supplier by ${currentUserName}`,
                actionContent: JSON.stringify(supplierDTO),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteSupplier: async(supplierId,currentUserName, currentUserId) =>{
        try{
            const findSupplier = await supplierModel.findSupplierById(supplierId)
            if(isEmpty(findSupplier)){
                const err = createError(400, `Supplier with id ${supplierId} does not exist.!`)
                throw err
            }

            await supplierModel.updateSupplier(supplierId, {isDeleted:true})
            const actionLogData = {
                relatedUserId: currentUserId,
                actionType: "Deleted supplier",
                actionSubject: `Deleted supplier by ${currentUserName}`,
                actionContent: JSON.stringify(supplierId),
            }
            await actionLogModel.createActionLog(actionLogData)
        }catch(err){
            return Promise.reject(err)
        }
    }
}

module.exports = supplierService
