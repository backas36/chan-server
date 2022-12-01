const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})
const _ = require("lodash")

const camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
module.exports = {
  development: {
    client: "postgresql",
    //debug: true,
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    //connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/config/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/config/seeds/" + process.env.NODE_ENV,
    },
    log: {
      error(message) {
        console.log(message)
      },
    },
    wrapIdentifier: (value, origImpl, queryContext) => {
      return origImpl(camelToSnakeCase(value))
    },
    postProcessResponse: (result, queryContext) => {
      // TODO: add special case for raw results
      // (depends on dialect)
      if (Array.isArray(result)) {
        return result.map((row) =>
          _.mapKeys(row, (value, key) => _.camelCase(key))
        )
      } else {
        return _.mapKeys(result, (value, key) => _.camelCase(key))
      }
    },
  },
  staging: {
    client: "postgresql",
    connection: process.env.POSTGRES_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/config/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/config/seeds/" + process.env.NODE_ENV,
    },
    wrapIdentifier: (value, origImpl, queryContext) => {
      return origImpl(camelToSnakeCase(value))
    },
    postProcessResponse: (result, queryContext) => {
      if (Array.isArray(result)) {
        return result.map((row) =>
          _.mapKeys(row, (value, key) => _.camelCase(key))
        )
      } else {
        return _.mapKeys(result, (value, key) => _.camelCase(key))
      }
    },
  },
  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/config/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: __dirname + "/config/seeds",
    },
  },
}
