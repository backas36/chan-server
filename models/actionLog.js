const db = require("../config/db")

const actionLogModel = {
  createActionLog: async (actionData) => {
    await db("actionLog").insert(actionData)
  },
  findAllActionLog: async (paramsData) => {
    const { q, s, n, order, filters } = paramsData
    const filterBuilder = (builder) => {
      if (filters) {
        const makeFilters = filters.split(".")
        makeFilters.forEach((filter) => {
          const [filed, value] = filter.split(":")
          if (filed === "actionType") {
            return builder.whereILike("action_log.actionType", value)
          }
          if (filed === "relatedUserName") {
            return builder.whereILike("user.name", value)
          }
        })
      }
    }

    const searchBuilder = (builder) => {
      if (q) {
        return builder
          .whereILike("action_log.actionSubject", "%" + q + "%")
          .orWhereILike("user.name", "%" + q + "%")
          .orWhereILike("action_log.actionType", "%" + q + "%")
      }
    }

    let query = db("action_log")
      .join("user", "action_log.relatedUserId", "=", "user.id")
      .select(
        "action_log.id",
        "user.name as relatedUserName",
        "action_log.actionType as Type",
        "action_log.actionSubject as subject",
        "action_log.actionContent as content",
        "action_log.createdAt as createdAt"
      )
      .where("action_log.is_deleted", false)
      .andWhere((builder) => searchBuilder(builder))
      .andWhere((builder) => filterBuilder(builder))

    if (order) {
      const [field, value] = order.split(":")
      query = query.orderBy(field, value, "last")
    }

    query = query.orderBy("action_log.created_at", "desc")
    const pageQuery = async (startIndex = 0, pageNumber = 50) => {
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
  findActionById:async (id) =>{
    const row = await db("actionLog")
        .join("user", "action_log.relatedUserId", "=", "user.id")
        .select(
            "action_log.id",
            "user.name as relatedUserName",
            "action_log.actionType as Type",
            "action_log.actionSubject as subject",
            "action_log.actionContent as content",
            "action_log.createdAt as createdAt"
        )
        .where("action_log.id", id)
        .andWhere("action_log.is_deleted", false)
    return row
  }
}
module.exports = actionLogModel
/**
 * {
 *  relatedUserId:userId,
 *  actionType:<string>,
 *  actionSubject:<string>,
 *  action_content:<JSON.stringify(content)>
 * }
 */
