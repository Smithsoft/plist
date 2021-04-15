import { Router } from "express"
import authController from "../controllers/auth"
import userSignupValidator from "../validators/auth"
import runValidation from "../validators"

const router = Router()

router.post('/api/signup', userSignupValidator, runValidation, authController)

export default router