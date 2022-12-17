/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .dropTableIfExists("units")
      .createTable("units", table => {
          table
              .uuid("id", { primaryKey: true, useBinaryUuid: true })
              .defaultTo(knex.raw("uuid_generate_v4()"))
          table.string("class") // jug, can, bottle
          table.string("unit") // ml, g, kg
          table.float("base") // 1000, 500, 1
          table.uuid("createdBy")
          table.boolean("isDeleted").notNullable().defaultTo(0)
          table.timestamp("updatedAt").defaultTo(knex.fn.now())
          table.timestamp("createdAt").defaultTo(knex.fn.now())
          table.foreign("createdBy")
              .references("user.id")
              .onDelete("CASCADE")
              .onUpdate("CASCADE")
      })

    await knex.schema
        .alterTable("product", table => {
            table.foreign("units_id")
                .references("units.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })

    await knex.schema
        .alterTable("ingredient", table => {
            table.foreign("units_id")
                .references("units.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await   knex.schema.dropTable("units")
};

// product