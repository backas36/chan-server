const express = require("express")
const router = express.Router()

const editorAuthHandler = require("../middleware/editorAuthHandler")

const productController = require("../controllers/product")
const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");


router.get("/", productController.listProducts)
router.get("/:productId", productController.getProduct)

router.post("/", authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, productController.createProduct )
router.patch("/:productId",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, productController.updateProduct)
router.delete("/:productId",authHandler, userStatusHandler, dashboardAuthHandler, editorAuthHandler, productController.deleteProduct)



module.exports = router
