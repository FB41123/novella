import { Router } from 'express';
import { getAllUsers, getUserById, updateUser , getUserNovels} from '../controllers/users';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// أضف هذا السطر مع بقية المسارات
router.get('/:id/novels', getUserNovels);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticateToken, updateUser);

export default router;