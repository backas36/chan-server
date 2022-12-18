const db = require("../config/db")

const ingredientModel = {
    findIngredientById: async(ingredientId)=>{
        const [ingredient] = await db("ingredient")
            .leftJoin("ingredientCategory", "ingredient.ingredientCategoryId", "=","ingredientCategory.id")
            .select("ingredient.*",
                "ingredientCategory.name as categoryName"
                )
            .where("ingredient.isDeleted", false)
            .andWhere("ingredient.id", ingredientId)
        console.log(ingredient)
        return ingredient
    },
    updateIngredientById: async(ingredientId, newData)=>{
        return db("ingredient").where({id:ingredientId}).update(newData)
    },
    createIngredient: async(newData)=>{
        const [id] = await db("ingredient").insert(newData).returning("id")
        return id
    },
    findAllIngredient: async(paramsData)=>{
        const { q, s, n, order, filters } = paramsData
        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("ingredient.name", value)
                    }
                    if (filed === "brand") {
                        return builder.whereILike("ingredient.brand", value)
                    }
                    if (filed === "unit") {
                        return builder.where("ingredient.unit","=", value)
                    }
                    if (filed === "size") {
                        return builder.whereILike("ingredient.size", value)
                    }
                    if (filed === "sku") {
                        return builder.whereILike("ingredient.sku", value)
                    }
                    if (filed === "description") {
                        return builder.whereILike("ingredient.description", value)
                    }
                    if (filed === "categoryName") {
                        return builder.whereILike("ingredientCategory.name", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("ingredient.name", "%" + q + "%")
                    .orWhereILike("ingredient.brand", "%" + q + "%")
                    .orWhereILike("ingredient.size", "%" + q + "%")
                    .orWhereILike("ingredient.sku", "%" + q + "%")
                    .orWhereILike("ingredient.description", "%" + q + "%")
                    .orWhereILike("ingredientCategory.name","%" + q + "%")

            }
        }

        let query = db("ingredient")
            .leftJoin("ingredientCategory", "ingredient.ingredientCategoryId", "=","ingredientCategory.id")
            .select("ingredient.*",
                "ingredientCategory.name as categoryName"
            )
            .where("ingredient.isDeleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("ingredient.created_at", "desc")

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
        console.log(data)
        return {
            totalLength,
            data,
        }
    },
}
module.exports = ingredientModel