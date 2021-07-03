import { check } from "express-validator"

const userSignupValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Must be a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const userSigninValidator = [
    check('email').isEmail().withMessage('Must be a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

const forgotPasswordValidator = [
    check('email').isEmail().withMessage('Must be a valid email address'),
]


const resetPasswordValidator = [
   check('newPassword')
       .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('resetPasswordLink')
        .isLength({ min: 32}).withMessage('Reset password link must be supplied')
]

export { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator }