import { Router } from "express"
import authController from "../controllers/auth"

const router = Router()

router.get('/api/signup', authController)

export default router