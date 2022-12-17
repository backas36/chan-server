/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries

  await knex('units').del()
  await knex('units').insert([
    {
      id: "89443930-546f-4c74-b8f2-e80af8a9b210",
      name:"jug",
      unit:"ml",
      base:1000,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5"
    },
    {
      id:"a3daca16-9bd6-4b78-96b4-674e57ebf346",
      name:"box",
      unit:"piece",
      base:10,
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5"
    }
  ]);

  await knex('poCategory').del()
  await knex('poCategory').insert([
    {
      id:"e2ee3cbf-b03d-40ec-b825-e3a080d40128",
      name:"madeleine",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5"
    },
  ])

  await knex('product').del()
  await knex('product').insert([
    {
      id:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      name:"original madeleine",
      price:60,
      poCategoryId:"e2ee3cbf-b03d-40ec-b825-e3a080d40128",
      description:"Classic French Madeleines",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
      unitsId:"a3daca16-9bd6-4b78-96b4-674e57ebf346"
    },
  ])

  await knex('poImages').del()
  await knex('poImages').insert([
    {
      id: "fb399f3d-76db-4730-a3bd-7134d53944e0",
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/chanchan-368709.appspot.com/o/product%2Ffb399f3d-76db-4730-a3bd-7134d53944e0%2Fpexels-hong-son-5194494.jpg?alt=media&token=44f8dd53-e303-4d1d-9621-b7b5c5da0293',
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5"
    },
  ]);



};
