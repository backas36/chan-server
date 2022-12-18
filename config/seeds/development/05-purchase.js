/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('supplier').del()
  await knex('supplier').insert([
    {
      id: "c91e281e-e11d-4bd3-bc2b-219921fa0e86",
      name: 'Aimee',
      type:"shopee",
      location:"https://shopee.tw/shop/15984217/search?shopCollection=28122818",
      contact:"bakery123",
    },
  ]);

  await knex('ingredient_category').del()
  await knex('ingredient_category').insert([
    {
      id: "63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      name: 'milk',
    },
  ]);

  await knex('ingredient').del()
  await knex('ingredient').insert([
    {
      id: "7c522fc6-8a57-496f-a902-a6b66b22cab5",
      name: 'whole milk',
      ingredientCategoryId:"63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      brand:"dairygood",
      unit:1200,
      size:"ml",
      sku:"jug",
      description:"not good for bakery",
    },
  ]);

  await knex('purchase').del()
  await knex('purchase').insert([
    {
      id: "684932b2-7ade-40e4-a9dd-dacb956452a4",
      ingredientId:"7c522fc6-8a57-496f-a902-a6b66b22cab5",
      supplierId:"c91e281e-e11d-4bd3-bc2b-219921fa0e86",
      quantity:10,
      purchaseDate:"2022-12-17",
      ingredientExpDate: '2022-12-30',
      unitPrice:180,
      purchasePrice:1800,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
  ]);
};
