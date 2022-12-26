const db = require("../config/db")

const userModel = {
  createUser: async (userData) => {
    const [id] = await db("user").insert(userData).returning("id")

    return id
  },
  findUserByEmail: async (email, identityType = null) => {
    const user = await db("user")
      .leftJoin("user_auth", "user.id", "=", "user_auth.userId")
      .select(
        "user.*",
        "user_auth.identityType as identity_type",
        "user_auth.identifier as identifier",
        "user_auth.credential as credential"
      )
      .where("user.email", email)
      .andWhere("user.is_deleted", false)
      .andWhere((builder) => {
        if (identityType) {
          builder.where("user_auth.identityType", identityType)
        }
      })
    return user
  },
  updateUserLoginTime: async (userId) => {
    return db("user")
      .where({ id: userId })
      .update({ last_login_at: new Date().toISOString() })
  },
  updateUserById: async (userId, newData) => {
    return db("user").where({ id: userId }).update(newData)
  },
  findUserById: async (userId, identityType = null) => {
    const user = await db("user")
      .leftJoin("user_auth", "user.id", "=", "user_auth.userId")
      .select(
        "user.*",
        "user_auth.identityType as identity_type",
        "user_auth.identifier as identifier",
        "user_auth.credential as credential"
      )
      .where("user.id", userId)
      .andWhere("user.is_deleted", false)
      .andWhere((builder) => {
        if (identityType) {
          builder.where("user_auth.identityType", identityType)
        }
      })

    return user
  },
  findAllUsers: async (paramsData) => {
    // q => query, s => start index, n => number of page, order => desc/asc (createdAt:desc) filter => (field1:value1.filed2:value2)
    const { q, s, n, order, filters } = paramsData

    const filterBuilder = (builder) => {
      if (filters) {
        const makeFilters = filters.split(".")
        makeFilters.forEach((filter) => {
          const [filed, value] = filter.split(":")
          if (filed === "status") {
            return builder.whereILike("user.status", value)
          }
          if (filed === "role") {
            return builder.whereILike("user.role", value)
          }
          if (filed === "identityType") {
            return builder.whereILike("user_auth.identityType", value)
          }
        })
      }
    }
    const searchBuilder = (builder) => {
      if (q) {
        return builder
          .whereILike("user.email", "%" + q + "%")
          .orWhereILike("user.name", "%" + q + "%")
          .orWhereILike("user.lineId", "%" + q + "%")
          .orWhereILike("user.address", "%" + q + "%")
      }
    }

    let query = db("user")
      .leftJoin("user_auth", "user.id", "=", "user_auth.userId")
      .select(
        "user.*",
        "user_auth.identityType as identity_type",
        "user_auth.identifier as identifier",
        "user.createdAt",
        "user.updatedAt"
      )
      .where("user.is_deleted", false)
      .andWhere((builder) => searchBuilder(builder))
      .andWhere((builder) => filterBuilder(builder))

    if (order) {
      const [field, value] = order.split(":")
      query = query.orderBy(field, value, "last")
    }

    query = query.orderBy("user.created_at", "desc")

    const pageQuery = async (startIndex , pageNumber ) => {
      if(startIndex === '' || !startIndex){
        startIndex = 0
      }
      if(pageNumber === '' || !pageNumber){
        pageNumber = 15
      }
      return (query) => query.limit(pageNumber).offset(startIndex)
    }
    const totalLength = (await query.clone()).length

    const completedQuery = await pageQuery(s, n)

    const data = await completedQuery(query)
    return {
      totalLength,
      data,
    }
  },
}

module.exports = userModel
