const createError = require("http-errors")

const unitService = require("../services/units")
const {isGuidValid} = require("../utils");

const unitsController = {
    getAllUnits:async(req,res, next)=>{
        const requestParams = req.query
        try{
            const units = await unitService.listUnits(requestParams)
            res.status(200).json({ success: true, message: "Get All Units", units })
        }catch(err){
            next(err)
        }
    },
    getUnit:async(req,res, next)=>{
        // const {name, unit, base} = req.body
        //
        // if(![name, unit, base].every(Boolean)){
        //     const error = createError(400, "Please enter fields completely.")
        //     return next(error)
        // }
        //
        // try{
        //     await unitService.createUnit(req.body, req.user.userId)
        //     res.status(201).json({success:true, message:"Unit created"})
        // }catch(err){
        //     next(err)
        // }
    },
    createUnit:async(req,res, next)=>{
        const {name, unit, base,createdBy} = req.body

        if(![name, unit, base,createdBy].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        if(typeof base !== 'number'){
            const error = createError(400, "base is not a number type.")
            return next(error)
        }
        try{
            await unitService.createUnit(req.body, req.user.currentUserName,
                req.user.userId)
            res.status(201).json({success:true, message:"Unit created"})
        }catch(err){
            next(err)
        }
    },
    updateUnit:async(req,res, next)=>{
        const unitId = req.params.unitId
        const {name, unit, base} = req.body
        if (!isGuidValid(unitId)) {
            const error = createError(400, "Invalid  id.")
            return next(error)
        }
        if(![name, unit, base].every(Boolean)){
            const error = createError(400, "Please enter fields completely.")
            return next(error)
        }
        if(typeof base !== 'number'){
            const error = createError(400, "base is not a number type.")
            return next(error)
        }
        try{
         await  unitService.updateUnit({unitId,data: req.body},req.user.currentUserName,
             req.user.userId)
            res.status(200).json({ success: true, message: "Unit Updated" })

        }catch(err){
            next(err)
        }
    },
    deleteUnit:async(req,res, next)=>{
        const unitId = req.params.unitId
        if (!isGuidValid(unitId)) {
            const error = createError(400, "Invalid  id.")
            return next(error)
        }
        try{
            await unitService.deleteUnit(unitId,req.user.currentUserName,  req.user.userId)
            res.status(200).json({ success: true, message: "Unit Deleted." })
        }catch(err){
            next(err)
        }
    }
}

module.exports = unitsController
