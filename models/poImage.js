const db = require("../config/db")

const poImageModel ={
    createPoImage:async(newData)=>{
        const [id] = await db("poImages").insert(newData).returning("id")
        return id
    },
    updatePoImageByImgId:async(poImageId, newData)=>{
        return db("poImages").where({ id: poImageId }).update(newData)
    },
    findPoImageByImgId:async(imgId) => {
        const poImages = await db("poImages")
            .innerJoin("product", "product.id", "=", "poImages.productId")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .select(
                "poImages.id as imageId",
                "poImages.imageUrl",
                "product.*",
                "poCategory.name as categoryName"
            )
            .where("poImages.id", imgId)
            .andWhere("poImages.is_deleted", false)
        return poImages
    },
    findPoImgByPoId:async(productId) => {
        const poImages = await db("poImages")
            .innerJoin("product", "product.id", "=", "poImages.productId")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .select(
                "poImages.id as imageId",
                "poImages.imageUrl",
                "product.*",
                "poCategory.name as categoryName"
            )
            .where("poImages.productId", productId)
            .andWhere("poImages.is_deleted", false)
        return poImages
    },
    findAllPoImg:async(paramsData) => {
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

                    if (filed === "categoryName") {
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

        let query = db("poImages")
            .innerJoin("product", "product.id", "=", "poImages.productId")
            .innerJoin("poCategory","poCategory.id","product.poCategoryId")
            .select(
                "poImages.id as imageId",
                "poImages.imageUrl",
                "product.*",
                "poCategory.name as categoryName"
            )
            .where("poImages.is_deleted", false)
            .andWhere((builder) => searchBuilder(builder))
            .andWhere((builder) => filterBuilder(builder))



        if (order) {
            const [field, value] = order.split(":")
            query = query.orderBy(field, value, "last")
        }

        query = query.orderBy("poImages.created_at", "desc")

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

module.exports = poImageModel