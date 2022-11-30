const db = require("../config/db")

const userAuthModel = {
  createUserAuth: async (userAuthData) => {
    const [id] = await db("user_auth").insert(userAuthData).returning("id")
  },
  findUserAuthByUserId: async (userId, identityType = null) => {
    return db("user_auth")
      .select("*")
      .where("is_deleted", false)
      .where("userId", userId)
      .andWhere((builder) => {
        if (identityType) {
          builder.where("user_auth.identityType", identityType)
        }
      })
  },
  updateUserAuthByUserId: async (id, newData) => {
    return db("user_auth")
      .where("userId", id)
      .andWhere("is_deleted", false)
      .update(newData)
  },
}
module.exports = userAuthModel
