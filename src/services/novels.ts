import api from './api';
import { Novel } from '@/lib/data'; 

export const getNovels = async (): Promise<Novel[]> => {
  try {
    const response = await api.get('/novels');
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  } catch (error) {
    console.error("Error fetching novels:", error);
    return [];
  }
};

export const getNovelById = async (id: string): Promise<Novel | undefined> => {
  try {
    const response = await api.get(`/novels/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching novel:", error);
    return undefined;
  }
};

export const createNovel = async (novelData: any) => {
  // 1. استخراج التوكن (بطاقة الهوية) من ذاكرة المتصفح
  const token = localStorage.getItem("token");

  // 2. إرسال الطلب مع التوكن في "الرأس" (Headers)
  const res = await fetch("https://novella-api.onrender.com/api/novels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // 👈 السطر السحري الذي يحل المشكلة
    },
    body: JSON.stringify(novelData)
  });

  const data = await res.json();

  // 3. التأكد من نجاح الطلب
  if (!res.ok) {
    throw new Error(data.message || data.error || "حدث خطأ من جهة السيرفر");
  }

  return data;
};