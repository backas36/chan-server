const express = require("express")
const router = express.Router()

const editorAuthHandler = require("../middleware/editorAuthHandler")

const productController = require("../controllers/product")


router.get("/", productController.listProducts)
router.get("/", productController.getProduct)

router.post("/",editorAuthHandler, productController.createProduct )
router.patch("/:productId", editorAuthHandler, productController.updateProduct)
router.delete("/:productId", editorAuthHandler, productController.deleteProduct)


module.exports = router
