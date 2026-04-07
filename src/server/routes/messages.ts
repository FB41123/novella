import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messages';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/:userId', authenticateToken, getMessages);
router.post('/', authenticateToken, sendMessage);

export default router;
