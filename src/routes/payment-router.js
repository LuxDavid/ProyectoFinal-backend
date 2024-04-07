import { Router } from 'express'
import passport from "passport";
import {authorization} from '../middlewares/middlewares.js'
import { cartToPay } from '../controllers/payment_controllers.js';

const router = Router()

router.post('/',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
cartToPay
)

export default router