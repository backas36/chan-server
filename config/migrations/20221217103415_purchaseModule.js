/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .dropTableIfExists("supplier")
      .createTable('supplier', table=> {
          table
              .uuid("id", { primaryKey: true, useBinaryUuid: true })
              .defaultTo(knex.raw("uuid_generate_v4()"))
          table.string('name')
          table.string("type")
          table.text('location')
          table.string('contact')
          table.boolean("isDeleted").notNullable().defaultTo(0)
          table.timestamp("updatedAt").defaultTo(knex.fn.now())
          table.timestamp("createdAt").defaultTo(knex.fn.now())
              table.unique(["name", "type"])
      })
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("purchase")
        .createTable("purchase", table => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("ingredient_id")
            table.uuid("supplier_id")
            table.float("quantity")
            table.date("purchase_date")
            table.date("ingredientExpDate")
            table.float("unitPrice")
            table.float("purchasePrice")
            table.uuid('createdBy')
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("createdBy")
                .references("user.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
            table.foreign("supplier_id")
                .references("supplier.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
        await   knex.schema.dropTable("supplier")
        await   knex.schema.dropTable("purchase")
};
