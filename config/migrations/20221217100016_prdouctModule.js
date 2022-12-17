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
        .dropTableIfExists("poCategory")
        .createTable("poCategory", (table) => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.string("name").unique()
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
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("product")
        .createTable("product", (table) => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.string("name")
            table.float("price")
            table.uuid("poCategoryId")
            table.text("description")
            table.uuid('createdBy')
            table.uuid("units_id")
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("poCategoryId")
                .references("poCategory.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
            table.foreign("createdBy")
                .references("user.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
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
