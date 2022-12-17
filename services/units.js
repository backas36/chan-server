const unitsModel = require("../models/units")

const unitsService ={
    listUnits:async (params) => {
        try{
            const units = unitsModel.findAllUnits(params)
            return units
        }catch(err){
            return Promise.reject(err)
        }
    },
    getUnit:async () => {
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    createUnit:async()=>{
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    updateUnit:async () => {
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },
    deleteUnit:async () => {
        try{

        }catch(err){
            return Promise.reject(err)
        }
    },

}

module.exports = unitsService
