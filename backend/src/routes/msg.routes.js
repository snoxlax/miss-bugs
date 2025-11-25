import express from 'express';
import { getMsgs, saveMsg, removeMsg } from '../controllers/msg.controller.js';
import { isAuthenticated } from '../middleware/authentication.js';
import { isAdmin } from '../middleware/authorization.js';

const router = express.Router();

router.get('/', getMsgs);
router.post('/', isAuthenticated, saveMsg);
router.put('/:msgId', isAuthenticated, saveMsg);
router.delete('/:msgId', isAuthenticated, isAdmin, removeMsg);

export default router;
