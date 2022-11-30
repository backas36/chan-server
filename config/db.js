require("dotenv").config()
const knex = require("knex")
const knexfile = require("../knexfile")

const env = process.env.NODE_ENV || "development"

const dbConfig = knexfile[env]

const db = knex(dbConfig)
module.exports = db
