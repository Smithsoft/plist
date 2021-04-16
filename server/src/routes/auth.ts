import { Router } from "express"
import { signUp, accountActivation } from "../controllers/auth"
import userSignupValidator from "../validators/auth"
import runValidation from "../validators"

const router = Router()

router.post('/api/signup', userSignupValidator, runValidation, signUp)
router.post('/api/account-activation', accountActivation)
export default router