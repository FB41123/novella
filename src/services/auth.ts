import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'reader' | 'writer';
  avatar?: string;
}

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token); // حفظ الدخول
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data?.error || "تأكد من تشغيل السيرفر أو صحة البيانات";
    alert("❌ فشل تسجيل الدخول: " + errorMsg);
    throw error;
  }
};

export const register = async (data: any): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post('/auth/register', data);
    localStorage.setItem('token', response.data.token); // حفظ الدخول
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data?.error || "تأكد من تشغيل السيرفر أو صحة البيانات";
    alert("❌ فشل إنشاء الحساب: " + errorMsg);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token'); // مسح الجلسة التالفة
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};