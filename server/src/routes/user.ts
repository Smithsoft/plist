import { Router } from 'express'
import  { readDetails, updateDetails } from '../controllers/user'
import { requireSignIn, adminMiddleware } from '../controllers/auth'

const router = Router()

router.get('/user/:id', requireSignIn, readDetails)
router.put('/user/update', requireSignIn, adminMiddleware, updateDetails)

export default router