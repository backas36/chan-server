const bcrypt = require("bcrypt")
const bcryptHelper = {
  compare: (painText, hashItem) => {
    return bcrypt.compareSync(painText, hashItem)
  },
}

module.exports = bcryptHelper
