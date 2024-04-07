import { Router } from 'express';
import { createCart, getCart, addProductCart, deletProductCart, overwriteCart, uptadeQuantityProduct, deletCart, purchase } from '../controllers/cart_controllers.js';
import passport from 'passport';
import { authorization } from '../middlewares/middlewares.js';

const router = Router()

//-------------------------------------------------------------------------------------

router.post('/',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
createCart );

//-------------------------------------------------------------------------------------

router.get('/:cid',
passport.authenticate('current', { session: false }),
authorization(['user','premium','admin']),
getCart);

//-------------------------------------------------------------------------------------

router.post('/:cid/product/:pid',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
addProductCart)

//-------------------------------------------------------------------------------------

router.delete('/:cid/product/:pid',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
deletProductCart)

//-------------------------------------------------------------------------------------

router.put('/:cid',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
overwriteCart )

//-------------------------------------------------------------------------------------

router.put('/:cid/product/:pid', 
passport.authenticate('current', { session: false }),
authorization(['admin','premium']),
uptadeQuantityProduct)

//-------------------------------------------------------------------------------------
router.delete('/:cid', 
authorization(['admin']),
deletCart)

//-------------------------------------------------------------------------------------

router.post('/purchase',
passport.authenticate('current', { session: false }),
authorization(['user','premium']),
purchase)

export default router