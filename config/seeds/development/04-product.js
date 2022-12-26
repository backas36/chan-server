/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {

  await knex('poCategory').del()
  await knex('poCategory').insert([
    {
      id:"e2ee3cbf-b03d-40ec-b825-e3a080d40128",
      name:"madeleine",
    },
  ])

  await knex('product').del()
  await knex('product').insert([
    {
      id:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      name:"Chan - original madeleine",
      fixedPrice:60,
      variant:"orignal",
      poCategoryId:"e2ee3cbf-b03d-40ec-b825-e3a080d40128",
      description:"Classic French Madeleines",
      sku:"piece",
    },
  ])

  await knex('poImages').del()
  await knex('poImages').insert([
    {
      id: "fb399f3d-76db-4730-a3bd-7134d53944e0",
      productId:"c0c8beaf-be50-4436-9bde-025f04a6bf39",
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/chanchan-368709.appspot.com/o/product%2Ffb399f3d-76db-4730-a3bd-7134d53944e0%2Fpexels-hong-son-5194494.jpg?alt=media&token=44f8dd53-e303-4d1d-9621-b7b5c5da0293',
    },
  ]);

};
