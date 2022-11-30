const createError = require("http-errors")
const bcrypt = require("bcrypt")
const isEmpty = require("lodash/isEmpty")
const omit = require("lodash/omit")

const userModel = require("../models/user")
const userAuthModel = require("../models/userAuth")
const {
  IDENTITY_TYPE,
  USER_GROUP_CODE,
  ACTION_TYPE,
} = require("../utils/constants")
const actionLogModel = require("../models/actionLog")

const saltRound = 10

const skipReqUserKeys = [
  "email",
  "identityType",
  "identifier",
  "password",
  "credential",
]

const userService = {
  //register: async (userDTO) => {
  //  const { email, password } = userDTO
  //  let groupCode = userDTO?.groupCode

  //  // default user
  //  if (!groupCode) {
  //    groupCode = USER_GROUP_CODE.user
  //  }

  //  try {
  //    const [userGroup] = await userGroupModel.findUserGroupByCode(groupCode)
  //    if (isEmpty(userGroup)) {
  //      const err = createError(
  //        400,
  //        `UserGroup with  ${groupCode} does not exist.!`
  //      )
  //      throw err
  //    }
  //    const user = await userModel.findUserByEmail(email)
  //    if (!isEmpty(user)) {
  //      const err = createError(409, "User with email is already exists.")
  //      throw err
  //    }

  //    const registerData = omit({ ...userDTO, userGroupId: userGroup.id }, [
  //      "groupCode",
  //      "password",
  //    ])

  //    const hashPassword = bcrypt.hashSync(password, saltRound)

  //    const { id } = await userModel.createUser(registerData)

  //    await userAuthModel.createUserAuth({
  //      userId: id,
  //      identityType: IDENTITY_TYPE.chanchan,
  //      identifier: email,
  //      credential: hashPassword,
  //    })

  //    const actionLogData = {
  //      relatedUserId: id,
  //      actionType: ACTION_TYPE.createUser,
  //      actionSubject: "User Register",
  //      actionContent: JSON.stringify({
  //        ...registerData,
  //        identityType: IDENTITY_TYPE.chanchan,
  //      }),
  //    }

  //    await actionLogModel.createActionLog(actionLogData)

  //    return id
  //  } catch (err) {
  //    return Promise.reject(err)
  //  }
  //},
  //createUser: async (userDTO, currentUserName) => {
  //  // create user if by admin, default pwd is birthDate
  //  const { email, birthDate, groupCode } = userDTO
  //  try {
  //    let userGroup

  //    ;[userGroup] = await userGroupModel.findUserGroupByCode(groupCode)
  //    if (isEmpty(userGroup)) {
  //      const err = createError(
  //        400,
  //        `UserGroup with  ${groupCode} does not exist.!`
  //      )
  //      throw err
  //    }

  //    const user = await userModel.findUserByEmail(email)
  //    if (!isEmpty(user)) {
  //      const err = createError(409, "User with email is already exists.")
  //      throw err
  //    }

  //    const subStringBirth = birthDate?.replace("-", "")
  //    const newUserData = omit(
  //      { ...user, ...userDTO, userGroupId: userGroup.id },
  //      ["groupCode", "groupName", "password", "lastLoginAt"]
  //    )

  //    const hashPassword = bcrypt.hashSync(subStringBirth, saltRound)
  //    const { id } = await userModel.createUser(newUserData)

  //    await userAuthModel.createUserAuth({
  //      userId: id,
  //      identityType: IDENTITY_TYPE.chanchan,
  //      identifier: email,
  //      credential: hashPassword,
  //    })
  //    const actionLogData = {
  //      relatedUserId: id,
  //      actionType: ACTION_TYPE.createUser,
  //      actionSubject: `Create User by ${currentUserName}`,
  //      actionContent: JSON.stringify({
  //        ...newUserData,
  //        identityType: IDENTITY_TYPE.chanchan,
  //      }),
  //    }
  //    await actionLogModel.createActionLog(actionLogData)

  //    return id
  //  } catch (err) {
  //    return Promise.reject(err)
  //  }
  //},
  getUserById: async (id, identityType) => {
    try {
      const findUser = await userModel.findUserById(id, identityType)
      if (isEmpty(findUser)) {
        const err = createError(400, `User with id ${id} does not exist.!!`)
        throw err
      }
      const user = omit(findUser[0], ["credential"])

      return user
    } catch (err) {
      return Promise.reject(err)
    }
  },
  changeMyProfile: async (userDTO) => {
    const { userId, data } = userDTO
    try {
      const [user] = await userModel.findUserById(userId)
      if (isEmpty(user)) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }
      const updatedData = omit({ ...user, ...data }, skipReqUserKeys)
      await userModel.updateUserById(userId, updatedData)
      await actionLogModel.createActionLog({
        relatedUserId: userId,
        actionType: ACTION_TYPE.updateProfile,
        actionSubject: "User update account detail",
        actionContent: JSON.stringify(updatedData),
      })
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  changeMyPassword: async (pwdDTO) => {
    const { userId, data } = pwdDTO
    try {
      const userAuth = await userAuthModel.findUserAuthByUserId(
        userId,
        IDENTITY_TYPE.chanchan
      )

      if (isEmpty(userAuth)) {
        const err = createError(400, `User with id ${userId} does not exist.!`)
        throw err
      }
      const { originalPassword, newPassword } = data
      const compareOldPassword = bcrypt.compareSync(
        originalPassword,
        userAuth[0].credential
      )

      if (!compareOldPassword) {
        const error = createError(401, "Password incorrect")
        throw error
      }
      const hashNewPassword = bcrypt.hashSync(newPassword, saltRound)
      await userAuthModel.updateUserAuthByUserId(userId, {
        credential: hashNewPassword,
      })
      await actionLogModel.createActionLog({
        relatedUserId: userId,
        actionType: ACTION_TYPE.updatePwd,
        actionSubject: "User changed password",
      })
      return
    } catch (err) {
      return Promise.reject(err)
    }
  },
  //listUsers: async (requestParams) => {
  //  try {
  //    const users = await userModel.findAllUsers(requestParams)
  //    return users
  //  } catch (err) {
  //    return Promise.reject(err)
  //  }
  //},
  //updateUserById: async (userDTO, currentUserName) => {
  //  const { userId, data } = userDTO
  //  const { groupCode } = data
  //  try {
  //    let userGroup = []
  //    if (groupCode) {
  //      ;[userGroup] = await userGroupModel.findUserGroupByCode(groupCode)
  //    }
  //    if (isEmpty(userGroup)) {
  //      const err = createError(
  //        400,
  //        `UserGroup with  ${groupCode} does not exist.!`
  //      )
  //      throw err
  //    }
  //    const [user] = await userModel.findUserById(userId)

  //    if (isEmpty(user)) {
  //      const err = createError(400, `User with id ${userId} does not exist.!`)
  //      throw err
  //    }

  //    const updatedData = omit(
  //      { ...user, ...data, userGroupId: userGroup.id },
  //      skipReqUserKeys
  //    )
  //    await userModel.updateUserById(userId, updatedData)
  //    const actionLogData = {
  //      relatedUserId: userId,
  //      actionType: ACTION_TYPE.updateAccount,
  //      actionSubject: `Update User by ${currentUserName}`,
  //      actionContent: JSON.stringify(updatedData),
  //    }
  //    await actionLogModel.createActionLog(actionLogData)
  //    return
  //  } catch (err) {
  //    return Promise.reject(err)
  //  }
  //},
  //deleteUserById: async (userId, currentUserName) => {
  //  try {
  //    const user = await userModel.findUserById(userId)
  //    if (user.length === 0) {
  //      const err = createError(400, `User with id ${userId} does not exist.!`)
  //      throw err
  //    }
  //    await userAuthModel.updateUserAuthByUserId(userId, {
  //      isDeleted: true,
  //    })
  //    await userModel.updateUserById(userId, { isDeleted: true })
  //    const actionLogData = {
  //      relatedUserId: userId,
  //      actionType: ACTION_TYPE.deleteAccount,
  //      actionSubject: `Update User by ${currentUserName}`,
  //      actionContent: null,
  //    }
  //    await actionLogModel.createActionLog(actionLogData)
  //    return
  //  } catch (err) {
  //    return Promise.reject(err)
  //  }
  //},
}

module.exports = userService
