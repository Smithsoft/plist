import { Router } from "express"
import { signUp, signIn, accountActivation } from "../controllers/auth"
import { userSignupValidator, userSigninValidator } from "../validators/auth"
import runValidation from "../validators"

const router = Router()

router.post('/signin', userSigninValidator, runValidation, signIn)
router.post('/signup', userSignupValidator, runValidation, signUp)
router.post('/account-activation', accountActivation)

export default router

