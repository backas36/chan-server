const knex = require("knex")
const knexfile = require("../knexfile")
const logger = require("../utils/logger")

const env = process.env.NODE_ENV || "development"
const dbConfig = knexfile[env]

const db = knex(dbConfig)

db.raw('SELECT 1')
    .then(()=>logger.info('DB connected ...'))
    .catch(err=>logger.error('DB failed ...', err))
module.exports = db
