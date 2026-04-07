import { Router } from 'express';
import { getPosts, createPost, likePost, commentPost, deletePost } from '../controllers/posts';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/feed', getPosts);
router.post('/', authenticateToken, createPost);
router.post('/:id/like', authenticateToken, likePost);
router.post('/:id/comment', authenticateToken, commentPost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
