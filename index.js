require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 8080

const morganHandler = require("./middleware/morganHandler")
const errorHandler = require("./middleware/errorHandler")
const userStatusHandler = require("./middleware/userStatusHandler")
const corsOptions = require("./config/corsOptions")
const logger = require("./utils/logger")
const authRouter = require("./routes/auth")
const meRouter = require("./routes/me")
const authHandler = require("./middleware/authHandler")

app.use(morganHandler)
app.use(cors(corsOptions))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  )
  next()
})

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/api/status", (req, res) => {
  logger.info("Checking the API status: Everything is OK")
  res.status(200).json({
    success: true,
    message: "The API is up and running!",
  })
})

app.use("/auth", authRouter)
app.use("/me", authHandler, userStatusHandler, meRouter)

app.use((req, res, next) => {
  res.status(404)
  res.json({ success: false, message: "The path not found" })
})

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`server is listening on port:${PORT} ...`)
})
