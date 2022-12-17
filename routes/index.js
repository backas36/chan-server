const express = require('express');
const router = express.Router();

const userController = require("../controllers/user");
const authRouter = require("./auth");
const authHandler = require("../middleware/authHandler");
const meRouter = require("./me");
const userStatusHandler = require("../middleware/userStatusHandler");
const dashboardAuthHandler = require("../middleware/dashboardAuthHandler");
const actionLogRouter = require("./actionLog");
const userRouter = require("./user");
const unitsRouter = require("./units");

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
router.use('/units', authHandler, userStatusHandler, dashboardAuthHandler, unitsRouter)
// app.use("/product", authHandler, userStatusHandler,dashboardAuthHandler, productRouter)

module.exports = router