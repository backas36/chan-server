const { USER_ROLES } = require("../utils/constants")

module.exports = async (req, res, next) => {
  const { role } = req.user
  if (role !== USER_ROLES.user) {
    return next()
  }
  return next(createError(403, "Access denied!"))
}
