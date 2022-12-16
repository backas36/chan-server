const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})
const express = require("express")
const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 8080

const morganHandler = require("./middleware/morganHandler")
const errorHandler = require("./middleware/errorHandler")
const userStatusHandler = require("./middleware/userStatusHandler")
const dashboardAuthHandler = require("./middleware/dashboardAuthHandler")
const authHandler = require("./middleware/authHandler")
const globalLimiter = require("./middleware/globalLimiter")

const corsOptions = require("./config/corsOptions")
const logger = require("./utils/logger")

const authRouter = require("./routes/auth")
const meRouter = require("./routes/me")
const actionLogRouter = require("./routes/actionLog")
const userRouter = require("./routes/user")
const allowedOrigins = require('./config/allowedOrigins')
const userController = require("./controllers/user")

app.use(morganHandler)
app.use(cors(corsOptions))
app.use((req, res, next) => {
  const origin = req.headers.origin
  if(allowedOrigins.includes(origin)){
    res.setHeader("Access-Control-Allow-Origin",origin)
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  )
  next()
})

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))


app.get("/health-check", (req, res) => {
  logger.info("Checking the API status: Everything is OK")
  res.status(200).json({
    success: true,
    message: "The API is up and running!",
  })
})

app.use(globalLimiter)

app.post("/register", userController.register)
app.post("/activate-account", userController.activateAccount)
app.post("/reset-password", userController.resetPassword)
app.post("/active-reset-password", userController.activeResetPassword)

app.use("/auth", authRouter)
app.use("/me", authHandler, meRouter)
app.use(
  "/action-log",
  authHandler,
  userStatusHandler,
  dashboardAuthHandler,
  actionLogRouter
)
app.use(
  "/users",
  authHandler,
  userStatusHandler,
  dashboardAuthHandler,
  userRouter
)

app.use((req, res, next) => {
  res.status(404)
  res.json({ success: false, message: "The path not found" })
})

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`server is listening on port:${PORT} ...`)
})
