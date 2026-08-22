import { Router } from 'express';
import { getChapter, createChapter, updateChapter } from '../controllers/chapters';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/:id', getChapter);
router.post('/', authenticateToken, requireRole(['writer', 'admin']), createChapter);
router.put('/:id', authenticateToken, requireRole(['writer', 'admin']), updateChapter);

export default router;
