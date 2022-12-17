const db = require("../config/db")

const productModel = {
    findProductById:async()=>{

    },
    updateProductById:async()=>{

    },
    createProduct:async()=>{

    },
    getProductById:async()=>{

    },
    findAllProduct:async(paramsData)=>{
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("product.name", value)
                    }
                    if (filed === "price") {
                        return builder.where("product.price", value)
                    }
                    if (filed === "createdByUserName") {
                        return builder.whereILike("user.name", value)
                    }
                    if (filed === "poCategoryName") {
                        return builder.whereILike("poCategory.name", value)
                    }
                    if (filed === "unitName") {
                        return builder.whereILike("units.name", value)
                    }
                    if (filed === "unit") {
                        return builder.whereILike("units.unit", value)
                    }
                    if (filed === "base") {
                        return builder.whereILike("units.base", value)
                    }
                })
            }
        }
        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("product.name", "%" + q + "%")
                    .orWhereILike("poCategory.name", "%" + q + "%")
                    .orWhereILike("units.name", "%" + q + "%")
                    .orWhereILike("user.name", "%" + q + "%")
                    .orWhere("product.price","=", q )

            }
        }

        let query = db("product")
            .leftJoin("user", "product.createdBy", "=", "user.id")
            .leftJoin("poCategory", "product.poCategoryId","=", "poCategory.id")
            .leftJoin("units", "product.unitsId","=", "units.id")
            .select(
                "product.name", "product.price","product.createdAt",
                "user.name as createdByUserName", "poCategory.name as poCategoryName",
                "units.name as unitName","units.unit as unit","units.base as base"
            )
            .where("product.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("product.created_at", "desc")

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
    },
}

module.exports = productModel