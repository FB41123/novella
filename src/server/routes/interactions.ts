import { Router } from 'express';
import { toggleFavorite, toggleFollow, getMyLibrary ,toggleLike, addComment} from '../controllers/interactions';
import { authenticateToken } from '../middlewares/auth'; // التأكد أن المستخدم مسجل دخول

const router = Router();

router.post('/favorite', authenticateToken, toggleFavorite);
router.post('/follow', authenticateToken, toggleFollow);
router.get('/library', authenticateToken, getMyLibrary);
router.post('/like', authenticateToken, toggleLike);
router.post('/comment', authenticateToken, addComment);
export default router;