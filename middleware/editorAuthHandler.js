const userService = require("../services/user")
const { USER_ROLES } = require("../utils/constants")
const allowRole = [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.editor]
module.exports = async (req, res, next) => {
  const { role } = req.user
  try {
    if (!allowRole.includes(role)) {
      throw new Error()
    }
    const currentUser = await userService.getUserById(req.user.userId)
    req.user = {
      ...req.user,
      currentUserName: currentUser.name,
    }
    return next()
  } catch (err) {
    next(createError(403, err?.message || "Access denied!"))
  }
}
