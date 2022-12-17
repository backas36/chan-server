/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .dropTableIfExists("actionLog")
    .createTable("actionLog", (table) => {
      table
        .uuid("id", { primaryKey: true, useBinaryUuid: true })
        .defaultTo(knex.raw("uuid_generate_v4()"))
      table.uuid("relatedUserId")
      table.string("actionType")
      table.text("actionSubject")
      table.json("actionContent")
      table.boolean("isDeleted").notNullable().defaultTo(0)
      table.timestamp("updatedAt").defaultTo(knex.fn.now())
      table.timestamp("createdAt").defaultTo(knex.fn.now())
      table
        .foreign("relatedUserId")
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
  return knex.schema.dropTable("actionLog")
}
