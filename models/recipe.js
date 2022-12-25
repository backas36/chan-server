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
                        return builder.where("recipe.ingredientId", value)
                    }
                    if (filed === "categoryId") {
                        return builder.where("inCa.id", value)
                    }
                    if (filed === "quantity") {
                        return builder.where("recipe.quantity", value)
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

        let latest =db("purchase")
            .select(
                "purchase.ingredientId", "purchase.unitPrice",
                db.raw(`row_number() over (PARTITION BY purchase.ingredient_id
                    ORDER BY purchase.purchase_date DESC
                ) AS row_numbers`)
            )
            .where("purchase.isDeleted", false)
            .as("latest")


        let groupLatest = db
            .select(
                "latest.ingredientId",
                db.raw(`round(CAST(avg(latest.unit_price) AS numeric),2) as latest_cost`)
            )
            .from(latest)
            .whereRaw(`latest.row_numbers <= 3`)
            .groupBy("latest.ingredient_id")
            .as("gl")
        let avgQuery = db
            .select("p.ingredientId",
                db.raw(`round(CAST(avg(p.unit_price) AS numeric),2) as avg_cost`)
            )
            .from("purchase as p")
            .where("p.isDeleted", false)
            .groupBy("p.ingredientId")
            .as("aq")

        let query = db("productIngredient as recipe")
            .select(
                "recipe.id", "inCa.id as categoryId",  "recipe.ingredientId",
                "recipe.createdBy","inCa.name as categoryName",
                "in.name",
              "recipe.quantity",
                "in.sku",
                "aq.avg_cost", "gl.latest_cost","in.description",
                "user.name as createdByName",
                "recipe.createdAt",

            )
            .leftJoin("ingredient as in", "recipe.ingredientId","in.id")
            .leftJoin("ingredientCategory as inCa", "in.ingredientCategoryId","inCa.id")
            .leftJoin(avgQuery, "recipe.ingredientId", "aq.ingredientId")
            .leftJoin(groupLatest, "recipe.ingredientId", "gl.ingredientId")
            .leftJoin("user", "recipe.createdBy", "user.id")
            .where("recipe.isDeleted", false)
            .andWhere("recipe.productId", productId)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))


        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("recipe.created_at", "desc")

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
    }
}

module.exports = recipeModel
