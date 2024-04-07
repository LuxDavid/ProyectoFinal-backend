import { Router } from "express";
import { tryLoggers } from "../controllers/logger_controller.js";
import passport from 'passport';
import { authorization } from '../middlewares/middlewares.js';

const router=Router();

router.get('/',
passport.authenticate('current', { session: false }),
authorization(['admin']),
tryLoggers);

export default router