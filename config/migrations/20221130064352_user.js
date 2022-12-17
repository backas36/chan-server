const { USER_ROLES, USER_STATUS } = require("../../utils/constants")
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .dropTableIfExists("user")
    .createTable("user", (table) => {
      table
        .uuid("id", {
          primaryKey: true,
          useBinaryUuid: true,
        })
        .defaultTo(knex.raw("uuid_generate_v4()"))
        .unique()
      table.string("name")
      table.string("email")
      table.string("role", 20).defaultTo(`${USER_ROLES.user}`)
      table.string("status", 20).defaultTo(`${USER_STATUS.active}`)
      table.date("birth_date")
      table.string("mobile")
      table.string("lineId")
      table.text("address")
      table.text("photoUrl")
      table.timestamp("lastLoginAt")
      table.boolean("isDeleted").notNullable().defaultTo(0)
      table.timestamp("updatedAt").defaultTo(knex.fn.now())
      table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user")
}
