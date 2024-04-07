import { Router } from "express";
import passport from "passport";
import {homeProducts, realTimeProducts, cartUser, register, login, profile, foundEmailPage, modify, finishSale, ticketSale } from "../controllers/views_controllers.js";
import {justPublicWitoutSession, authorizationViews, authorization} from '../middlewares/middlewares.js'

const router=Router();

router.get('/', justPublicWitoutSession ,passport.authenticate('current', { session: false }), homeProducts);

router.get('/realTimeProducts',
passport.authenticate('current', { session: false }),
authorization(['user','premium','admin']),
realTimeProducts );

router.get('/carts/:cid',
passport.authenticate('current', { session: false }),
authorization(['user','premium',]),
cartUser);

router.get('/api/session/register', register );

router.get('/api/session/login', login);

router.get('/api/session/current',
passport.authenticate('current', { session: false }),
authorization(['user','premium','admin']),
profile);

router.get('/api/session/foundEmailUser', foundEmailPage);

router.get('/api/session/modify',
passport.authenticate('current', { session: false }) ,
authorizationViews(['admin']),
modify);

router.get('/api/session/finishSale', 
passport.authenticate('current', { session: false }) ,
authorizationViews(['user','premium']),
finishSale
)

router.get('/api/session/ticket', 
passport.authenticate('current', { session: false }) ,
authorizationViews(['user','premium']),
ticketSale
)

export default router