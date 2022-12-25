const db = require("../config/db")
const knex = require("knex");

const recipeModel = {
    findRecipeById:async (recipeId) => {
        const [recipe] = await db("productIngredient")
            .select()
            .where("productIngredient.isDeleted", false)
            .andWhere("productIngredient.id", recipeId)
        return recipe
    },
    updateRecipeById: async(recipeId, newData) => {
        return db("productIngredient").where({id:recipeId}).update(newData)
    },
    createRecipe:async(newData) => {
      const [id] = await db("productIngredient")
          .insert(newData)
          .returning("id")

        return id
    },
    findRecipeByProductId: async (productId, paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "categoryName") {
                        return builder.whereILike("inCa.name", value)
                    }
                    if (filed === "ingredientId") {
                        return builder.where("cost.ingredientId", value)
                    }
                    if (filed === "categoryId") {
                        return builder.where("inCa.id", value)
                    }
                    if (filed === "quantity") {
                        return builder.where("cost.quantity", value)
                    }
                    if (filed === "name") {
                        return builder.whereILike("ingredient.name", value)
                    }
                    if (filed === "sku") {
                        return builder.whereILike("ingredient.sku", value)
                    }
                    if(filed === 'createdByName'){
                        return builder.whereILike("user.name", value)
                    }
                })
            }
        }
        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("inCa.name", "%" + q + "%")
                    .orWhereILike("ingredient.sku", "%" + q + "%")
                    .orWhereILike("ingredient.name", "%" + q + "%")
                    .orWhereILike("ingredient.description", "%" + q + "%")
                    .orWhereILike("user.name","%" + q + "%")


            }
        }

        let costQuery = db("productIngredient as recipe")
            .select(
                "recipe.id", "recipe.createdBy",
                "recipe.ingredientId","recipe.quantity","recipe.createdAt",
                db.raw(`json_agg(json_build_object(
                    'purchaseDate', purchase.purchase_date, 'unitPrice', purchase.unit_price
                ) ORDER BY  purchase.purchase_date DESC ) AS cost_list`)
            )
            .leftJoin("purchase", "recipe.ingredientId", "purchase.ingredientId")
            .where("recipe.isDeleted", false)
            .andWhere("recipe.productId", productId)
            .groupBy("recipe.id","recipe.createdBy","recipe.ingredientId","recipe.quantity","recipe.createdAt").as("cost")
        let query = db(costQuery)
            .select(
                "cost.id", "cost.createdBy",
                "cost.ingredientId","inCa.id as categoryId",
                "cost.quantity",
                "inCa.name as categoryName","ingredient.name",
                "ingredient.sku","ingredient.description",
                "cost.costList",
                "user.name as createdByName",
                "cost.createdAt"
                )
            .leftJoin("ingredient", "cost.ingredientId","ingredient.id")
            .leftJoin("ingredientCategory as inCa", "ingredient.ingredientCategoryId","inCa.id")
            .leftJoin("user", "cost.createdBy", "user.id")
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))


        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("cost.created_at", "desc")

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

// recipeModel.findRecipeByProductId("db44901b-a165-466c-ad44-873981b86ccf",{})
module.exports = recipeModel
