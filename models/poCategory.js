const db = require("../config/db")

const poCategoryModel = {
    findPoCategoryById:async(poCategoryId)=>{
        const poCategory = await db("poCategory")
            .select("poCategory.*")
            .where("poCategory.is_deleted", false)
            .andWhere("poCategory.id", poCategoryId)
        return poCategory
    },
    findPoCategoryByName:async(poCategoryName)=>{
        const poCategory = await db("poCategory")
            .select("poCategory.*")
            .where("poCategory.is_deleted", false)
            .andWhere("poCategory.name", poCategoryName)
        return poCategory
    },
    updatePoCategoryById:async(poCategoryId, newData)=>{
        return db("poCategory").where({id:poCategoryId}).update(newData)
    },
    createPoCategory:async(data)=>{
        const [id] = await db("poCategory").insert(data).returning("id")
        return id
    },
    findAllPoCategory : async (paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("poCategory.name", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("poCategory.name", "%" + q + "%")
            }
        }

        let query = db("poCategory")
            .select(
                "poCategory.*")
            .where("poCategory.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("poCategory.created_at", "desc")

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

module.exports = poCategoryModel
