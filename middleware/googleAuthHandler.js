const createError = require("http-errors")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const { IDENTITY_TYPE } = require("../utils/constants")

module.exports = async (req, res, next) => {
  try {
    let user
    if (!req?.headers?.authorization) {
      next(createError.Unauthorized())
      return
    }
    const accessToken = req?.headers?.authorization.split(" ")[1] || null
    if (!accessToken) {
      next(createError.Unauthorized())
      return
    }

    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    user = {
      //id: payload.sub,
      iss: payload.iss,
      name: payload.name,
      photoUrl: payload.picture,
      email: payload.email,
      reqVerifyType: IDENTITY_TYPE.google,
    }

    req.user = user
    next()
    return
  } catch (err) {
    next(createError.Unauthorized(err?.message || "Unauthorized"))
  }
}
