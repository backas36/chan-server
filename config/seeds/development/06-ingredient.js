/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('product_ingredient').del()
  await knex('product_ingredient').insert([
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '7c522fc6-8a57-496f-a902-a6b66b22cab5',
      quantity:20,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '6a27ca72-4964-4707-a393-93abf73a756d',
      quantity:2,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '4067a573-fa0a-4fac-8953-ef50e1dc5684',
      quantity:80,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '6fae77bb-2461-4af1-835a-6c4b907415e5',
      quantity:20,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: 'a78b3852-d5db-4533-bc64-2b12a5f54b02',
      quantity:60,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: 'deb84f88-9a04-4b4a-bee5-17d1cd57981c',
      quantity:4,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '68abeff6-b387-475e-9730-69c3acafc7ff',
      quantity:10,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      ingredientId: '864a2fc3-8b0d-4e1d-b5d2-601371b0be09',
      quantity: 100,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
  ]);
};
