const constants = {
  USER_STATUS: {
    active: "active",
    blocked: "blocked",
    temporary: "temporary",
    inactive: "inactive",
  },
  USER_ROLES: {
    superAdmin: "super admin",
    admin: "admin",
    editor: "editor",
    basic: "basic",
    user: "user",
  },
  IDENTITY_TYPE: {
    chanchan: "chanchan-api",
    google: "google",
  },
  JWT_TYPE: {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    newAccount: "newAccount",
    resetPwd: "resetPwd",
  },
  ACTION_TYPE: {
    register: "register",
    createUser: "create user",
    updatePwd: "change password",
    updateProfile: "update profile",
    updateAccount: "update account",
    deleteAccount: "delete account",
    activeAccount: "active account",
    resetPassword: "reset password",
    resendActivate:"resend activate mail"
  },
}

module.exports = constants
