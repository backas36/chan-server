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
    {
      id: "44c74955-dbd6-4882-bcad-eccfcd01ef49",
      name: '旺來昌',
      type:"on site",
    },
    {
      id: "864a2fc3-8b0d-4e1d-b5d2-601371b0be09",
      name: 'Costco',
      type:"on site",
    },
  ]);

  await knex('ingredient_category').del()
  await knex('ingredient_category').insert([
    {
      id: "63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      name: 'milk',
    },
    {
      id: "7121e93e-5fb7-4609-9804-661a27550022",
      name: 'egg',
    },
    {
      id: "02ac1672-ab0f-4f68-a3a1-53e38a424f7c",
      name: 'sugar',
    },
    {
      id: "83fdf0d1-e9b0-4cb6-a401-c5e3845fe09c",
      name: 'powder',
    },
    {
      id: "fa6527eb-8bc0-4dea-9d14-06e7b4751919",
      name: 'choco',
    },
    {
      id: "42b8e1be-54fb-4d29-8dc6-413f2f62f438",
      name: 'butter',
    },
    {
      id: "7dda1e46-5773-4f48-810c-46699f07b730",
      name: 'others',
    },
  ]);

  await knex('ingredient').del()
  await knex('ingredient').insert([
    {
      id: "7c522fc6-8a57-496f-a902-a6b66b22cab5",
      name: 'regular milk',
      ingredientCategoryId:"63ee719d-5a5f-4ced-8c11-dfa015cf993e",
      sku:"ml",
      description:"not good for bakery",
    },
    {
      id: "6a27ca72-4964-4707-a393-93abf73a756d",
      name: 'regular egg',
      ingredientCategoryId:"7121e93e-5fb7-4609-9804-661a27550022",
      sku:"piece",
    },
    {
      id: "4067a573-fa0a-4fac-8953-ef50e1dc5684",
      name: '上白糖',
      ingredientCategoryId:"02ac1672-ab0f-4f68-a3a1-53e38a424f7c",
      sku:"g",
    },
    {
      id: "6fae77bb-2461-4af1-835a-6c4b907415e5",
      name: '杏仁粉',
      ingredientCategoryId:"83fdf0d1-e9b0-4cb6-a401-c5e3845fe09c",
      sku:"g",
    },
    {
      id: "a78b3852-d5db-4533-bc64-2b12a5f54b02",
      name: '低筋麵粉',
      ingredientCategoryId:"83fdf0d1-e9b0-4cb6-a401-c5e3845fe09c",
      sku:"g",
    },
    {
      id: "deb84f88-9a04-4b4a-bee5-17d1cd57981c",
      name: '泡打粉',
      ingredientCategoryId:"83fdf0d1-e9b0-4cb6-a401-c5e3845fe09c",
      sku:"g",
    },
    {
      id: "68abeff6-b387-475e-9730-69c3acafc7ff",
      name: '抹茶粉',
      ingredientCategoryId:"83fdf0d1-e9b0-4cb6-a401-c5e3845fe09c",
      sku:"g",
    },
    {
      id: "864a2fc3-8b0d-4e1d-b5d2-601371b0be09",
      name: '無鹽奶油',
      ingredientCategoryId:"42b8e1be-54fb-4d29-8dc6-413f2f62f438",
      sku:"g",
    },
  ]);

  await knex('purchase').del()
  await knex('purchase').insert([
    {
      id: "684932b2-7ade-40e4-a9dd-dacb956452a4",
      ingredientId:"7c522fc6-8a57-496f-a902-a6b66b22cab5",
      supplierId:"c91e281e-e11d-4bd3-bc2b-219921fa0e86",
      quantity:1858,
      purchaseDate:"2022-01-17",
      ingredientExpDate: '2022-12-30',
      unitPrice:0.09,
      purchasePrice:166,
      brand:"福樂",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "2efbc5f2-3afe-4069-9765-435d023a7257",
      ingredientId:"6a27ca72-4964-4707-a393-93abf73a756d",
      supplierId:"864a2fc3-8b0d-4e1d-b5d2-601371b0be09",
      quantity:20,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:9.5,
      purchasePrice:190,
      brand:"others",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "527ae95d-d0eb-4204-8dea-090a54286454",
      ingredientId:"4067a573-fa0a-4fac-8953-ef50e1dc5684",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:1000,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.095,
      purchasePrice:95,
      brand:"台糖",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "3a6dc7de-12cc-448b-b016-0ae518583fdf",
      ingredientId:"6fae77bb-2461-4af1-835a-6c4b907415e5",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:450,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.396,
      purchasePrice:178,
      brand:"先知味",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "dd9532d8-63c8-4d14-b13d-95916f15fcb1",
      ingredientId:"6fae77bb-2461-4af1-835a-6c4b907415e5",
      supplierId:"864a2fc3-8b0d-4e1d-b5d2-601371b0be09",
      quantity:1360,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.323,
      purchasePrice:439,
      brand:"costco",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "41a74278-a9f5-46a3-ada5-1767fbd9c975",
      ingredientId:"a78b3852-d5db-4533-bc64-2b12a5f54b02",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:1000,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.098,
      purchasePrice:98,
      brand:"水手牌",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "f7f4de6f-63d2-4a0d-aa0d-1fc894daf429",
      ingredientId:"a78b3852-d5db-4533-bc64-2b12a5f54b02",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:2000,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.027,
      purchasePrice:54,
      brand:"泰旺",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "02ce4f6d-4aa2-455f-bc5c-88aa1dd2081e",
      ingredientId:"deb84f88-9a04-4b4a-bee5-17d1cd57981c",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:113,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.619,
      purchasePrice:70,
      brand:"巧伴師",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "de048501-34b7-46b7-b14b-38e3f374a2bb",
      ingredientId:"68abeff6-b387-475e-9730-69c3acafc7ff",
      supplierId:"c91e281e-e11d-4bd3-bc2b-219921fa0e86",
      quantity:100,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:3.95,
      purchasePrice:395,
      brand:"小山圓",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "89e88df9-20c2-4725-ab42-fcefaf0ea8ee",
      ingredientId:"68abeff6-b387-475e-9730-69c3acafc7ff",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:200,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:2.1,
      purchasePrice:420,
      brand:"日本丸山",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
    {
      id: "d463dfa0-e2e4-4b91-8d2c-77a49b3f4ec8",
      ingredientId:"864a2fc3-8b0d-4e1d-b5d2-601371b0be09",
      supplierId:"44c74955-dbd6-4882-bcad-eccfcd01ef49",
      quantity:454,
      purchaseDate:"2022-02-17",
      ingredientExpDate: '2024-12-30',
      unitPrice:0.308,
      purchasePrice:140,
      brand:"安佳",
      createdBy:"D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
    },
  ]);
};
