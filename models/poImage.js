const db = require("../config/db")

const poImageModel ={
    // {productId, imageUrl}
    createPoImage:async(newData)=>{
        const [id] = await db("poImages").insert(newData).returning("id")
        return id
    },
    updatePoImageByImgId:async(poImageId, newData)=>{
        return db("poImages").where({ id: poImageId }).update(newData)
    },
    findPoImages:async(productId) => {
        const poImages = await db("poImages")
            .innerJoin("product", "product.id", "=", "poImages.productId")
            .select("poImages.*", "product.name")
            .where("poImages.productId", productId)
            .andWhere("poImages.is_deleted", false)
        return poImages
    },
}


module.exports = poImageModel