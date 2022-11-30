/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .dropTableIfExists("userAuth")
    .createTable("userAuth", (table) => {
      table
        .uuid("id", { primaryKey: true, useBinaryUuid: true })
        .unique()
        .defaultsTo(knex.raw("uuid_generate_v4()"))
      table.uuid("userId").unique()
      table.string("identityType")
      table.string("identifier")
      table.text("credential")
      table.boolean("isDeleted").notNullable().defaultTo(0)
      table.timestamp("updatedAt").defaultTo(knex.fn.now())
      table.timestamp("createdAt").defaultTo(knex.fn.now())
      table
        .foreign("userId")
        .references("user.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("userAuth")
}
