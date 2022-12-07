module.exports = {
    passwordValidate: (plainPwd) => {
        const passwordReg = /^(?=.*[A-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        return passwordReg.test(plainPwd)
    },
}
