import axios from 'axios';

// التعديل السحري هنا: دمجنا الرابط مع كلمة /api مباشرة
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// هذا هو "السطر السحري" الذي يرفق بطاقة دخولك (Token) مع كل طلب تلقائياً
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;