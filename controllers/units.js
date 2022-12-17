const createError = require("http-errors")

const unitService = require("../services/units")

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
        try{

        }catch(err){
            next(err)
        }
    },
    createUnit:async(req,res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    },
    updateUnit:async(req,res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    },
    deleteUnit:async(req,res, next)=>{
        try{

        }catch(err){
            next(err)
        }
    }
}

module.exports = unitsController
