/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .dropTableIfExists("in_inventory")
      .createTable("in_inventory", table => {
          table
              .uuid("id", { primaryKey: true, useBinaryUuid: true })
              .defaultTo(knex.raw("uuid_generate_v4()"))
          table.uuid("ingredient_id")
          table.foreign("ingredient_id")
              .references("ingredient.id")
              .onDelete("CASCADE")
              .onUpdate("CASCADE")
      })
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("po_inventory")
        .createTable("po_inventory", table => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("product_id")
            table.foreign("product_id")
                .references("product.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable("in_inventory")
    await knex.schema.dropTable("po_inventory")
};
