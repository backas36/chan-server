const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
})
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  service: "Gmail",
  // port: 465,
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.AUTH_PASS,
  },
})

//TODO update email template
const smtpMailService = {
  sendNewAccount: async (email, token) => {
    try {
      await transporter.sendMail({
        from: "ChanChan",
        to: email,
        subject: "New Account in ChanChan",
        html: `<a href='${process.env.CLIENT_URL}/active-account?token=${token}'>Click here to set password</a>`,
      })
    } catch (err) {
      return Promise.reject(err)
    }
  },
  sendResetPwd: async (email, token) => {
    try {
      await transporter.sendMail({
        from: "ChanChan",
        to: email,
        subject: "Reset password in ChanChan account",
        html: `<a href='${process.env.CLIENT_URL}/active-account?token=${token}'>Click here to reset password</a>`,
      })
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
module.exports = smtpMailService
