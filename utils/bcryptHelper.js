const bcrypt = require("bcrypt")
const saltRound = 10

const bcryptHelper = {
  compare: (painText, hashItem) => {
    return bcrypt.compareSync(painText, hashItem)
  },
  hashData: (painText) => {
    return bcrypt.hashSync(painText, saltRound)
  },
}

module.exports = bcryptHelper
