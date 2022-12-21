const db = require("../config/db")

const supplierModel = {
    findSupplierById:async(supplierId)=>{
        const supplier = await db("supplier")
            .select("supplier.*")
            .where("supplier.is_deleted", false)
            .andWhere("supplier.id", supplierId)
        return supplier
    },
    finSupplierByName:async(findData)=>{
    const supplier = await db("supplier")
        .select("supplier.*")
        .where("supplier.is_deleted", false)
        .andWhere("supplier.name", findData.name)
        .andWhere("supplier.type", findData.type)
        return supplier
    },
    updateSupplier:async(supplierId, newData)=>{
      return db("supplier").where({id:supplierId}).update(newData)
    },
    createSupplier:async(newData)=>{
        const [id] = await db("supplier").insert(newData).returning("id")
        return id
    },
    findAllSuppliers : async (paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "name") {
                        return builder.whereILike("supplier.name", value)
                    }
                    if (filed === "type") {
                        return builder.whereILike("supplier.type", value)
                    }
                    if (filed === "location") {
                        return builder.whereILike("supplier.location", value)
                    }
                    if (filed === "contact") {
                        return builder.whereILike("supplier.contact", value)
                    }
                })
            }
        }

        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("supplier.name", "%" + q + "%")
                    .orWhereILike("supplier.type", "%" + q + "%")
                    .orWhereILike("supplier.location", "%" + q + "%")
                    .orWhereILike("supplier.contact", "%" + q + "%")

            }
        }

        let query = db("supplier")
            .select(
                "supplier.*")
            .where("supplier.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))

        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("supplier.created_at", "desc")

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

module.exports = supplierModel