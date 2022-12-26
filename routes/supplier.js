const express = require("express")
const router = express.Router()

const supplierController = require("../controllers/supplier")

const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/", supplierController.listSuppliers)
router.get("/:supplierId", supplierController.getSupplierById)

router.post("/", editorAuthHandler, supplierController.createSupplier)
router.patch("/:supplierId", editorAuthHandler, supplierController.updateSupplier)
router.delete("/:supplierId", editorAuthHandler, supplierController.deleteSupplier )


module.exports = router