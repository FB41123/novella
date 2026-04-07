import api from './api';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts');
    // هذه الإضافة تضمن أنه إذا كانت البيانات ليست مصفوفة، فسيُرجع مصفوفة فارغة بدلاً من انهيار الموقع
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const createPost = async (content: string): Promise<Post | null> => {
  try {
    // نرسل المحتوى للباك اند ليقوم بإنشاء المنشور وربطه باسم المستخدم الحقيقي
    const response = await api.post('/posts', { content });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};