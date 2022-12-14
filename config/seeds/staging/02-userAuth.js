/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("userAuth").del()
  await knex("userAuth").insert([
    {
      id: "0974f585-e72b-4cad-8d92-e12fe22bf350",
      userId: "D1B9CE0D-D61D-41ED-84B0-6B5F22C730A5",
      identityType: "chanchan-api",
      identifier: "backas36@gmail.com",
      credential:
        "$2b$10$FEcobLNIi0acccwHTJriSOqSfVR6hAmomb3M6Jizj8.1JWfDCmOiG",
    },
  ])
}
