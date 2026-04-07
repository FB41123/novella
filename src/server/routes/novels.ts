import { Router } from 'express';
import { getAllNovels, getNovelById, createNovel, updateNovel, deleteNovel, togglePublishStatus ,getAdminNovels} from '../controllers/novels';
// 👈 أضفنا استيراد الحارس هنا (تأكد من حرف s في middlewares)
import { authenticateToken } from '../middlewares/auth'; 
import { togglePublish } from '../controllers/novels'; // مع بقية الدوال
const router = Router();

// 🟢 مسارات عامة (مسموحة للجميع بدون تسجيل دخول)
router.get('/', getAllNovels);
router.get('/:id', getNovelById);
// أضفه هنا قبل مسار الـ ID
router.get('/admin/all', authenticateToken, getAdminNovels);
router.patch('/:id/publish', authenticateToken, togglePublish);

// 🔴 مسارات محمية (لن تمر إلا بعد المرور على الحارس authenticateToken)
router.post('/', authenticateToken, createNovel); 
router.patch('/:id/publish', authenticateToken, togglePublishStatus);
router.put('/:id', authenticateToken, updateNovel);
router.delete('/:id', authenticateToken, deleteNovel);

export default router;