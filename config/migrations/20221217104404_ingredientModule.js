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
          table.string("name")
          table.uuid('createdBy')
          table.boolean("isDeleted").notNullable().defaultTo(0)
          table.timestamp("updatedAt").defaultTo(knex.fn.now())
          table.timestamp("createdAt").defaultTo(knex.fn.now())
          table.foreign("createdBy")
              .references("user.id")
              .onDelete("CASCADE")
              .onUpdate("CASCADE")
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
            table.uuid("units_id")
            table.string("brand")
            table.text("description")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("ingredient_category_id")
                .references("ingredient_category.id")
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
};
