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
    {
      id: "ac9b9c73-f746-4604-b72b-a55f087181f6",
      userId: "7E4ED07C-9391-46F0-A71B-6E679A2EA473",
      identityType: "chanchan-api",
      identifier: "basic@gmail.com",
      credential:
        "$2b$10$FEcobLNIi0acccwHTJriSOqSfVR6hAmomb3M6Jizj8.1JWfDCmOiG",
    },
    {
      id: "28c9e3d5-675b-4d79-9341-6e88700dc291",
      userId: "94BB9859-2864-457B-A858-84311498DF4E",
      identityType: "chanchan-api",
      identifier: "editor@gmail.com",
      credential:
        "$2b$10$FEcobLNIi0acccwHTJriSOqSfVR6hAmomb3M6Jizj8.1JWfDCmOiG",
    },
    {
      id: "f7d07b67-3f00-4b7e-a135-8316e04205e4",
      userId: "a363a5e9-246f-402c-a6c8-55b980594f23",
      identityType: "chanchan-api",
      identifier: "user@gmail.com",
      credential:
        "$2b$10$FEcobLNIi0acccwHTJriSOqSfVR6hAmomb3M6Jizj8.1JWfDCmOiG",
    },
  ])
}
