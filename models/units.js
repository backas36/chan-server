const db = require("../config/db")

const unitsModel = {
    findUnitById:async(unitId)=>{
        const unit = await db("units")
            .leftJoin("user", "units.createdBy", "=", "user.id")
            .select(
                "units.*",
                "user.name"
            )
            .where("units.id", unitId)
            .where("units.is_deleted", false)
        return unit
    },
    updateUnitById:async(unitId, newData)=>{
        return db("units").where({id:unitId}).update(newData)
    },
    createUnit:async(data)=>{
        const [id] = await db("units").insert(data).returning("id")
        return id
    },
    findAllUnits : async (paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("units.name", value)
                    }
                    if (filed === "unit") {
                        return builder.whereILike("units.unit", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("units.name", "%" + q + "%")
                    .orWhereILike("units.unit", "%" + q + "%")
            }
        }

        let query = db("units")
            .leftJoin("user", "units.createdBy", "=", "user.id")
            .select(
                "units.*",
                "user.name"
            )
            .where("units.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("units.created_at", "desc")

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

module.exports = unitsModel
