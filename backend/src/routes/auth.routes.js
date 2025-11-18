import express from 'express';
import {
  login,
  signup,
  logout,
  checkAuth,
} from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middleware/authentication.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/checkAuth', isAuthenticated, checkAuth);

export default router;
