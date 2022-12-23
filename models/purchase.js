const db = require("../config/db")

const purchaseModel = {
    findPurchaseById:async(purchaseId)=>{
        const [purchase] = await db
            .select(
                "purchase.id",
                "purchase.quantity","purchase.purchaseDate",
                "purchase.ingredientExpDate", "purchase.unitPrice",
                "purchase.purchasePrice",
                "supplier.id as supplierId",
                "ingredient.id as ingredientId",
                "ingredientCategory.name as categoryName",
                "user.name as createdByName",
                "purchase.createdAt",
                "purchase.updatedAt",
            )
            .from("purchase")
            .leftJoin("supplier","supplier.id","purchase.supplierId")
            .leftJoin("ingredient","ingredient.id","purchase.ingredientId")
            .leftJoin("user","user.id", "purchase.createdBy")
            .innerJoin("ingredientCategory","ingredientCategory.id","ingredient.ingredientCategoryId")
            .where("purchase.isDeleted", false)
            .andWhere("purchase.id", purchaseId)
        return purchase
    },
    updatePurchase:async(purchaseId, newData)=>{
        return db("purchase").where({id:purchaseId}).update(newData)
    },
    createPurchase:async(newData)=>{
        const [id] =await db("purchase")
            .insert(newData)
            .returning("id")
        return id
    },
    findAllPurchase:async(paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "quantity") {
                        return builder.where("purchase.quantity",'=', value)
                    }
                    if (filed === "unitPrice") {
                        return builder.where("purchase.unitPrice",'=', value)
                    }
                    if(filed === 'purchaseDate'){
                        return builder.where("purchase.purchaseDate","=", value)
                    }
                    if(filed === 'ingredientExpDate'){
                        return builder.where("purchase.ingredientExpDate","=", value)
                    }
                    if(filed === 'purchasePrice'){
                        return builder.where("purchase.purchasePrice","=", value)
                    }
                    if(filed === 'createdByName'){
                        return builder.whereILike("user.name", value)
                    }
                    if (filed === "supplierId") {
                        return builder.where("supplier.id","=",   value )
                    }
                    if (filed === "type") {
                        return builder.where("supplier.type", value)
                    }
                    if (filed === "ingredientId") {
                        return builder.where("ingredient.id",value)
                    }
                    if (filed === "brand") {
                        return builder.where("ingredient.brand", value)
                    }
                    if (filed === "unit") {
                        return builder.where("ingredient.unit","=", value)
                    }
                    if (filed === "size") {
                        return builder.where("ingredient.size","=", value)
                    }
                    if (filed === "sku") {
                        return builder.where("ingredient.sku","=", value)
                    }
                    if (filed === "categoryName") {
                        return builder.where("ingredientCategory.name","=", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("supplier.name", "%" + q + "%")
                    .orWhereILike("supplier.type", "%" + q + "%")
                    .orWhereILike("ingredient.name","%" + q + "%")
                    .orWhereILike("ingredient.brand", "%" + q + "%")
                    .orWhereILike("ingredientCategory.name", "%" + q + "%")
                    .orWhereILike("user.name","%" + q + "%")
            }
        }

        let query = db
            .select(
                "purchase.id",
                "purchase.quantity","purchase.purchaseDate",
                "purchase.ingredientExpDate", "purchase.unitPrice",
                "purchase.purchasePrice",
                "supplier.id as supplierId",
                "ingredient.id as ingredientId",
                "ingredientCategory.name as categoryName",
                "user.name as createdByName",
                "purchase.createdAt",
                "purchase.updatedAt",
            )
            .from("purchase")
            .leftJoin("supplier","supplier.id","purchase.supplierId")
            .leftJoin("ingredient","ingredient.id","purchase.ingredientId")
            .leftJoin("user","user.id", "purchase.createdBy")
            .innerJoin("ingredientCategory","ingredientCategory.id","ingredient.ingredientCategoryId")
            .where("purchase.isDeleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))
        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }else{
         query = query.orderBy("purchase.created_at", "desc")
        }


        const pageQuery = async (startIndex , pageNumber) => {
            if(startIndex === '' || !startIndex){
                startIndex = 0
            }
            if(pageNumber === '' || !pageNumber){
                pageNumber = 15
            }
            return (query) => query.limit(pageNumber).offset(startIndex)
        }

        const totalLength = (await query.clone()).length
        const completedQuery = await pageQuery(s, n)

        const data = await completedQuery(query)
        return {
            totalLength,
            data,
        }
    }
}
module.exports = purchaseModel

/**
 *              "purchase.id",
 *                 "purchase.quantity","purchase.purchaseDate",
 *                 "purchase.ingredientExpDate", "purchase.unitPrice",
 *                 "purchase.purchasePrice",
 *                     "supplier.id as supplierId",
 *                 "supplier.name as supplierName", "supplier.type as supplierType",
 *                 "supplier.location", "supplier.contact as supplierContact",
 *                 "ingredient.id as ingredientId",
 *                 "ingredient.name as ingredientName", "ingredient.brand as ingredientBrand",
 *                 "ingredient.unit as ingredientUnit", "ingredient.size as ingredientSize",
 *                 "ingredient.sku as ingredientSku","ingredient.description as ingredientDesc",
 *                 "ingredientCategory.name as categoryName",
 *                 "user.name as createdByName",
 *                 "purchase.createdAt",
 *                 "purchase.updatedAt",
 */