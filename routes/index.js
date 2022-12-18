const express = require('express');
const router = express.Router();

const authHandler = require("../middleware/authHandler");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");

const authRouter = require("./auth");
const meRouter = require("./me");
const userRouter = require("./user");
const productRouter = require("./product")
const ingredientRouter = require("./ingredient")
const poCategoryRouter = require("./poCategory")
const inCategoryRouter = require("./inCategory")

const userController = require("../controllers/user");
const actionLogRouter = require("./actionLog");

router.post("/register", userController.register)
router.post("/activate-account", userController.activateAccount)
router.post("/reset-password", userController.resetPassword)
router.post("/active-reset-password", userController.activeResetPassword)

router.use("/auth", authRouter)
router.use("/me", authHandler, meRouter)
router.use(
    "/action-log",
    authHandler,
    userStatusHandler,
    dashboardAuthHandler,
    actionLogRouter
)
router.use(
    "/users",
    authHandler,
    userStatusHandler,
    dashboardAuthHandler,
    userRouter
)
router.use("/products", productRouter)
router.use("/products-category", poCategoryRouter)
router.use("/ingredients",authHandler,
    userStatusHandler,
    dashboardAuthHandler, ingredientRouter)
router.use("/ingredient-category",authHandler,
    userStatusHandler,
    dashboardAuthHandler,inCategoryRouter )

module.exports = router