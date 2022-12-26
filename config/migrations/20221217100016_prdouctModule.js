/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("poImages")
        .createTable("poImages", (table) => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("productId")
            table.text("imageUrl")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
        })
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("poCategory")
        .createTable("poCategory", (table) => {
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
        .dropTableIfExists("product")
        .createTable("product", (table) => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("poCategoryId")
            table.string("name")
            table.float("fixedPrice")
            table.string("variant")
            table.string("sku")
            table.text("description")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("poCategoryId")
                .references("poCategory.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
            table.unique(["poCategoryId", "variant"])
        })
    await knex.schema
        .alterTable("poImages", table => {
            table.foreign("productId")
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
    await   knex.schema.dropTable("product")
    await   knex.schema.dropTable("poImages")
    await   knex.schema.dropTable("poCategory")
};
