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
    },
    {
      id: "7E4ED07C-9391-46F0-A71B-6E679A2EA473",
      role: USER_ROLES.admin,
      name: "test",
      email: "test@test.com",
    },
  ])
}
