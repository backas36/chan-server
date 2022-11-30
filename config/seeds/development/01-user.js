const { USER_ROLES } = require("../../../utils/constants")
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user").del()
  await knex("user").insert([
    {
      id: "D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
      role: USER_ROLES.superAdmin,
      name: "ashiyang",
      email: "backas36@gmail.com",
      birthDate: "1989-03-06",
      //password: "$2b$10$kaRmOwURRIcbzmL6x.YvXOuZYutMUs1uS5JIRsag03gLhjFV/cxam",
    },
    {
      id: "7E4ED07C-9391-46F0-A71B-6E679A2EA473",
      role: USER_ROLES.basic,
      name: "basic",
      email: "basic@gmail.com",
    },
    {
      id: "94BB9859-2864-457B-A858-84311498DF4E",
      role: USER_ROLES.editor,
      name: "editor",
      email: "editor@gmail.com",
    },
    {
      id: "a363a5e9-246f-402c-a6c8-55b980594f23",
      role: USER_ROLES.user,
      name: "user",
      email: "user@gmail.com",
    },
  ])
}
