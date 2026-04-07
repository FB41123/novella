import { Router } from 'express';
import { createCharacter, updateCharacter, deleteCharacter } from '../controllers/characters';
import { authenticateToken, requireRole } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateToken, requireRole(['writer', 'admin']), createCharacter);
router.put('/:id', authenticateToken, requireRole(['writer', 'admin']), updateCharacter);
router.delete('/:id', authenticateToken, requireRole(['writer', 'admin']), deleteCharacter);

export default router;