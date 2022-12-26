const express = require("express")
const router = express.Router()

const recipeController = require("../controllers/recipe")
const editorAuthHandler = require("../middleware/editorAuthHandler");

router.get("/:productId", recipeController.listAllRecipeByPoId)

router.post("/:productId",editorAuthHandler, recipeController.createRecipe)
router.patch("/:recipeId", editorAuthHandler, recipeController.updateRecipeById)
router.delete("/:recipeId", editorAuthHandler, recipeController.deleteRecipeById)
module.exports = router