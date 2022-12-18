const createError = require("http-errors")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")
const poCategoryModel = require("../models/poCategory");

const poCategoryService ={
    findPoCategoryByName:async(categoryName)=>{
        let categoryId
        try{
            const [findPoCategory] = await poCategoryModel.findPoCategoryByName(categoryName)
            if(isEmpty(findPoCategory)){
                const {id} = await poCategoryModel.createPoCategory({name:categoryName})
                categoryId = id
            }else{
                categoryId = findPoCategory.id
            }
            return categoryId
        }catch(err){
            return Promise.reject(err)
        }
    }
}

module.exports = poCategoryService
