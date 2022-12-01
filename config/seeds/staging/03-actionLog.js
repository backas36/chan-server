/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("actionLog").del()
  await knex("actionLog").insert([
    {
      relatedUserId: "D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
      actionType: "user",
      actionSubject: "create user",
      actionContent: `{"name":"yoyoyo","email":"yoyoyo@gmail.com"}`,
    },
  ])
}
