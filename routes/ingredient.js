const express = require("express")
const router = express.Router()

const ingredientController = require("../controllers/ingredient")
const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/", ingredientController.listIngredients)
router.get("/:ingredientId", ingredientController.getIngredient)

router.post("/",editorAuthHandler, ingredientController.createIngredient)
router.patch("/:ingredientId",editorAuthHandler, ingredientController.updateInventory)
router.delete("/:ingredientId",editorAuthHandler, ingredientController.deleteIngredient)
module.exports = router