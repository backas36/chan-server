/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('in_inventory').del()
  await knex('in_inventory').insert([
    {
      ingredientId: '7c522fc6-8a57-496f-a902-a6b66b22cab5'
    },
  ]);

  await knex('po_inventory').del()
  await knex('po_inventory').insert([
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
    },
  ]);


};
