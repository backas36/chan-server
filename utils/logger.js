const winston = require("winston")
const { combine, timestamp, json, colorize, align, printf } = winston.format
require("winston-daily-rotate-file")

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d",
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    //colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    //json()
  ),
  transports: [
    new winston.transports.Console({
      format: colorize({ all: true }),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      //format: combine(errorFilter(), timestamp(), json()),
    }),
    fileRotateTransport,
  ],
})

module.exports = logger
