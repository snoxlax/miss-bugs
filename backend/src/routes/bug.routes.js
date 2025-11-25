import express from 'express';
import {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  downloadBugs,
} from '../controllers/bugs.controller.js';
import { isAuthenticated } from '../middleware/authentication.js';

const router = express.Router();

router.get('/', getBugs);
router.get('/download', downloadBugs);
router.get('/:id', getBug);

router.post('/', isAuthenticated, createBug);
router.put('/:id', isAuthenticated, updateBug);
router.delete('/:id', isAuthenticated, deleteBug);

export default router;
