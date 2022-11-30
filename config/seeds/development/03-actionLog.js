/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("actionLog").del()
  await knex("actionLog").insert([
    {
      relatedUserId: "7E4ED07C-9391-46F0-A71B-6E679A2EA473",
      actionType: "user",
      actionSubject: "create user",
      actionContent: `{"name":"yoyoyo","email":"yoyoyo@gmail.com"}`,
    },
    {
      relatedUserId: "D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
      actionType: "user group",
      actionSubject: "create user group",
      actionContent: `{"userGroupName":"blocked","createAt":"2022-07-12 09:14:15.270000"}`,
    },
  ])
}
