const db = require("../config/db")

const unitsModel = {
    findUnitById:async()=>{},
    updateUnitById:async()=>{},
    createUnit:async()=>{},
    findAllUnits : async (paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "class") {
                        return builder.whereILike("units.class", value)
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
                    .whereILike("units.class", "%" + q + "%")
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

        const pageQuery = async (startIndex = 0, pageNumber = 50) => {
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
