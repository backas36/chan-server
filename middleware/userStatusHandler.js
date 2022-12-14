const createError = require("http-errors")
const { USER_STATUS } = require("../utils/constants")

module.exports = async (req, res, next) => {
  try {
    const { status } = req.user
    if (USER_STATUS.active !== status) {
      next(createError(404,`This account has been suspended! Try to contact the admin`))
      return
    }

    next()
  } catch (err) {
    next(
      createError(401,
        err?.message ||
          `This account has been suspended! Try to contact the admin`
      )
    )
  }
}
