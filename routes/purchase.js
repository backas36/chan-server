const express = require("express")
const router = express.Router()

const purchaseController = require("../controllers/purchase")

const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/", purchaseController.listAllPurchase)
router.get("/:purchaseId", purchaseController.getPurchase)

router.post("/", editorAuthHandler, purchaseController.createPurchase )
router.patch("/:purchaseId", editorAuthHandler, purchaseController.updatePurchase)
router.delete("/:purchaseId", editorAuthHandler, purchaseController.deletedPurchase)

module.exports = router