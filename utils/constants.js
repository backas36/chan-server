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
    createAccount: "createAccount",
  },
}

module.exports = constants
