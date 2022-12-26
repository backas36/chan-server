const db = require("../config/db")

const inCategoryModel = {
    findInCategory:async(inCategoryId)=>{
        const inCategory = await db("ingredientCategory")
            .select("ingredientCategory.*")
            .where("ingredientCategory.is_deleted", false)
            .andWhere("ingredientCategory.id", inCategoryId)
        return inCategory
    },
    findInCategoryByName:async(inCategoryName)=>{
        const inCategory = await db("ingredientCategory")
            .select("ingredientCategory.*")
            .where("ingredientCategory.is_deleted", false)
            .andWhere("ingredientCategory.name", inCategoryName)
        return inCategory
    },
    updateInCategoryById:async(inCategoryId, newData)=>{
        return db("ingredientCategory").where({id:inCategoryId}).update(newData)
    },
    createInCategory:async(data)=>{
        const [id] = await db("ingredientCategory").insert(data).returning("id")
        return id
    },
    findAllInCategory : async (paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("ingredientCategory.name", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("ingredientCategory.name", "%" + q + "%")
            }
        }

        let query = db("ingredientCategory")
            .select(
                "ingredientCategory.*")
            .where("ingredientCategory.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("ingredientCategory.created_at", "desc")

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

module.exports = inCategoryModel