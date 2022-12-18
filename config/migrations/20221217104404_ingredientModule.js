/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async  function(knex) {
  await knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .dropTableIfExists("ingredient_category")
      .createTable("ingredient_category", table=>{
          table
              .uuid("id", { primaryKey: true, useBinaryUuid: true })
              .defaultTo(knex.raw("uuid_generate_v4()"))
          table.string("name").unique()
          table.boolean("isDeleted").notNullable().defaultTo(0)
          table.timestamp("updatedAt").defaultTo(knex.fn.now())
          table.timestamp("createdAt").defaultTo(knex.fn.now())
      })
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("ingredient")
        .createTable("ingredient", table=>{
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.string('name')
            table.uuid("ingredient_category_id")
            table.string("brand")
            table.float("unit")
            table.string("size")
            table.string("sku")
            table.text("description")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("ingredient_category_id")
                .references("ingredient_category.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
            table.unique(["ingredient_category_id", "brand","unit","size"])

        })
    await knex.schema
        .alterTable("purchase", table => {
            table.foreign("ingredient_id")
                .references("ingredient.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("product_ingredient")
        .createTable("product_ingredient", table => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("product_id")
            table.uuid("ingredient_id")
            table.float("quantity")
            table.uuid("createdBy")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("createdBy")
                .references("user.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await   knex.schema.dropTable("ingredient_category")
    await   knex.schema.dropTable("ingredient")
    await knex.schema.dropTable("product_ingredient")
};
