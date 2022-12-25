const db = require("../config/db")

const ingredientModel = {
    findIngredientById: async(ingredientId)=>{
        let latest = db("purchase")
            .select(
                "purchase.ingredientId", "purchase.unitPrice",
                db.raw(`row_number() over (PARTITION BY purchase.ingredient_id
                    ORDER BY purchase.purchase_date DESC
                ) AS row_numbers`)
            )
            .where("purchase.isDeleted", false)
            .andWhere("purchase.ingredientId", ingredientId)
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
            .andWhere("p.ingredientId",ingredientId)
            .groupBy("p.ingredientId")
            .as("aq")

        const [ingredient] = await db("ingredient as in")
            .select("in.*",
                "inCa.name as category",
                "aq.avg_cost", "gl.latest_cost"
                )
            .leftJoin(avgQuery, "in.id", "aq.ingredientId")
            .leftJoin(groupLatest, "in.id", "gl.ingredientId")
            .leftJoin("ingredientCategory as inCa", "in.ingredientCategoryId", "inCa.id")
            .where("in.isDeleted", false)
            .andWhere("in.id", ingredientId)
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
                    if (filed === "sku") {
                        return builder.whereILike("ingredient.sku", value)
                    }
                    if (filed === "category") {
                        return builder.whereILike("ingredientCategory.name", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("ingredient.name", "%" + q + "%")
                    .orWhereILike("ingredient.sku", "%" + q + "%")
                    .orWhereILike("ingredient.description", "%" + q + "%")
                    .orWhereILike("ingredientCategory.name","%" + q + "%")

            }
        }

        let latest = db("purchase")
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

        let query = db("ingredient as in")
            .select("in.*","inCa.name as category",
                "aq.avg_cost", "gl.latest_cost")
            .leftJoin(avgQuery, "in.id", "aq.ingredientId")
            .leftJoin(groupLatest, "in.id", "gl.ingredientId")
            .leftJoin("ingredientCategory as inCa", "in.ingredientCategoryId","inCa.id")
            .where("in.isDeleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))


        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("in.created_at", "desc")

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
ingredientModel.findIngredientById("a78b3852-d5db-4533-bc64-2b12a5f54b02")
module.exports = ingredientModel