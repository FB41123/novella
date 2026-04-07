import { Router } from 'express';
import { getChapter, createChapter } from '../controllers/chapters';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/:id', getChapter);
router.post('/', authenticateToken, requireRole(['writer', 'admin']), createChapter);

export default router;
