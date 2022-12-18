const db = require("../config/db")
const productModel = {
    findProductById:async(productId)=>{
        const [product] = await db.select(
            "product.*",
            "poCategory.name as category",
        )
            .from("product")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .where("product.id", productId)
            .andWhere("product.isDeleted", false)
        return product
    },
    findProductByName:async(productName)=>{
        const [product] = await db.select(
            "product.*",
            "poCategory.name as category",
        )
            .from("product")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .where("product.name", productName)
            .andWhere("product.isDeleted", false)
        return product
    },
    updateProductById:async(productId, newData)=>{
        return db("product").where({id:productId}).update(newData)
    },
    createProduct:async(newData)=>{
        const [id] =await db("product")
            .insert(newData)
            .returning("id")
        return id
    },
    findAllProduct:async(paramsData)=>{
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "productName") {
                        return builder.where("product.name", value)
                    }
                    if (filed === "price") {
                        return builder.where("product.price", value)
                    }

                    if (filed === "category") {
                        return builder.whereILike("poCategory.name", value)
                    }
                    if (filed === "sku") {
                        return builder.whereILike("product.sku", value)
                    }
                    if (filed === "variant") {
                        return builder.whereILike("product.variant", value)
                    }

                })
            }
        }
        const searchBuilder = (builder) => {
            if (q) {
                return builder
                    .whereILike("product.name", "%" + q + "%")
                    .orWhereILike("product.description", "%" + q + "%")
                    .orWhereILike("product.sku", "%" + q + "%")
                    .orWhereILike("poCategory.name", "%" + q + "%")
                    .orWhereILike("product.variant","%" + q + "%")
            }
        }

        let query = db.select(
            "product.*",
            "poCategory.name as category",
        )
            .from("product")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .where("product.isDeleted", false)
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
        console.log(data)
        return {
            totalLength,
            data,
        }
    },
}
module.exports = productModel
