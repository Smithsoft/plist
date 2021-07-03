import { Router } from "express"
import { signUp, signIn, forgotPassword, resetPassword, accountActivation } from "../controllers/auth"
import { userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth"
import { runValidation } from "../validators"

const router = Router()

router.post('/signin', userSigninValidator, runValidation, signIn)
router.post('/signup', userSignupValidator, runValidation, signUp)
router.post('/account-activation', accountActivation)

// forgot/reset password
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

export default router

