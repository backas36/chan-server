/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ingredient_category').del()
  await knex('ingredient_category').insert([
    {
      id: "63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      name: 'milk',
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
  ]);

  await knex('ingredient').del()
  await knex('ingredient').insert([
    {
      id: "7c522fc6-8a57-496f-a902-a6b66b22cab5",
      name: 'whole milk',
      ingredientCategoryId:"63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      unitsId:"89443930-546f-4c74-b8f2-e80af8a9b210",
      brand:"dairygood",
      description:"not good for bakery",
    },
  ]);
};
