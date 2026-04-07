import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireRole(['admin']), updateSettings);

export default router;
