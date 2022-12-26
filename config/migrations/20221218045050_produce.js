/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .dropTableIfExists("produce")
        .createTable("produce", (table) => {
            table
                .uuid("id", { primaryKey: true, useBinaryUuid: true })
                .defaultTo(knex.raw("uuid_generate_v4()"))
            table.uuid("productId")
            table.float("quantity")
            table.date("exp_date")
            table.uuid('createdBy')
            table.boolean("isDeleted").notNullable().defaultTo(0)
            table.timestamp("updatedAt").defaultTo(knex.fn.now())
            table.timestamp("createdAt").defaultTo(knex.fn.now())
            table.foreign("createdBy")
                .references("user.id")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
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
    await   knex.schema.dropTable("produce")
};
