const db = require("../config/db")

const recipeModel = {
    findRecipeByPoId: async(productId, paramsData) => {
        const { q, s, n, order, filters } = paramsData

        const filterBuilder = (builder) => {
            if (filters) {
                const makeFilters = filters.split(".")
                makeFilters.forEach((filter) => {
                    const [filed, value] = filter.split(":")
                    if (filed === "poCategoryName") {
                        return builder.where("poCategory.name", value)
                    }
                    if (filed === "productName") {
                        return builder.where("product.name", value)
                    }
                    if (filed === "productPrice") {
                        return builder.where("product.price",'=', value)
                    }
                    if (filed === "quantity") {
                        return builder.where("recipe.quantity",'=', value)
                    }
                    if (filed === "unitPrice") {
                        return builder.where("cost.unitPrice",'=', value)
                    }
                    if (filed === "productVariant") {
                        return builder.where("product.variant", value)
                    }
                    if (filed === "productSku") {
                        return builder.where("product.sku", value)
                    }
                    if (filed === "ingredientName") {
                        return builder.where("ingredient.name", value)
                    }

                    if (filed === "ingredientBrand") {
                        return builder.where("ingredient.brand", value)
                    }

                    if (filed === "ingredientUnit") {
                        return builder.where("ingredient.unit",'=', value)
                    }
                    if (filed === "ingredientSize") {
                        return builder.where("ingredient.size", value)
                    }
                    if (filed === "inCategoryName") {
                        return builder.where("inCa.name", value)
                    }
                    if (filed === "createByName") {
                        return builder.where("user.name", value)
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
                    .orWhereILike("ingredient.name","%" + q + "%")
                    .orWhereILike("ingredient.brand","%" + q + "%")
                    .orWhereILike("ingredient.size","%" + q + "%")
                    .orWhereILike("ingredient.description","%" + q + "%")
                    .orWhereILike("user.name","%" + q + "%")
            }
        }

        let subQuery = db("productIngredient as recipe")
            .select("recipe.ingredientId").avg("purchase.unitPrice as unitPrice")
            .innerJoin("purchase", "recipe.ingredientId", "purchase.ingredientId")
            .where("recipe.isDeleted",false)
            .andWhere("recipe.productId", productId)
            .groupBy('recipe.ingredientId').as("cost")

        let query = db
            .select(
                "recipe.id", "recipe.productId",
                "recipe.ingredientId",
                "poCategory.name as poCategoryName",
                "product.name as productName", "product.price as productPrice",
                "recipe.quantity",
                "cost.unitPrice",
                "product.variant as productVariant", "product.sku as productSku",
                "ingredient.id as IngredientId",
                "ingredient.name as ingredientName", "ingredient.brand as ingredientBrand",
                "ingredient.unit as ingredientUnit", "ingredient.size as ingredientSize",
                "ingredient.description as ingredientDesc",
                "inCa.name as inCategoryName",
                "user.name as createByName",
            )
            .innerJoin(subQuery, "recipe.ingredientId", "cost.ingredientId")
            .innerJoin("product","recipe.productId","product.id")
            .innerJoin("ingredient", "recipe.ingredientId","ingredient.id")
            .innerJoin("ingredientCategory as inCa","ingredient.ingredientCategoryId","inCa.id")
            .innerJoin("user", "recipe.createdBy","user.id")
            .innerJoin('poCategory', "product.poCategoryId", "poCategory.id")
            .from("productIngredient as recipe")
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
        data.forEach(row => row.cost=(row.quantity* row.unitPrice))
        // console.log({
        //     totalLength,
        //     data,
        // })
        return {
            totalLength,
            data,
        }
    }
}
// recipeModel.findRecipeByPoId("c0c8beaf-be50-4436-9bde-025f04a6bf39",{filters:"createByName:ashiyang"})
module.exports = recipeModel
