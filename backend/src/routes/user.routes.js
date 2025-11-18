import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import { isAdmin } from '../middleware/authorization.js';
import { isAuthenticated } from '../middleware/authentication.js';

const router = express.Router();

// All routes require authentication and admin access
router.get('/', isAuthenticated, isAdmin, getUsers);
router.get('/:id', isAuthenticated, isAdmin, getUser);
router.post('/', isAuthenticated, isAdmin, createUser);
router.put('/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

export default router;
