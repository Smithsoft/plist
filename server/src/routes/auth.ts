import { Router } from "express"
import authController from "../controllers/auth"

const router = Router()

router.post('/api/signup', authController)

export default router