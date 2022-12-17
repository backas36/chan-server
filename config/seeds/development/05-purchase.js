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
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5"
    },
  ]);

  await knex('purchase').del()
  await knex('purchase').insert([
    {
      id: "684932b2-7ade-40e4-a9dd-dacb956452a4",
      ingredientId:"c2cfd0b4-230e-4df0-91da-978ab148b160",
      supplierId:"c91e281e-e11d-4bd3-bc2b-219921fa0e86",
      quantity:10,
      purchaseDate:"2022-12-17",
      ingredientExpDate: '2022-12-30',
      purchasePrice:1800,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
  ]);
};
