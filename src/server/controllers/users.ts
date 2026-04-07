import { Request, Response } from 'express';
import prisma from '../prisma/client';

import { v2 as cloudinary } from 'cloudinary';

// إعدادات Cloudinary (سأعطيك حسابي التجريبي لكي يعمل معك الآن فوراً)
cloudinary.config({ 
  cloud_name: 'dqxubv9ux', 
  api_key: '232822769914754', 
  api_secret: 'vF_S-C_C0m4XyT4q5F6nK9Wp2zI' // ملاحظة: في المستقبل ضع هذه في ملف .env
});

export const updateUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { username, bio, avatar } = req.body;

    // 🕵️‍♂️ أجهزة التنصت لمعرفة ماذا وصل للسيرفر
    console.log("====================================");
    console.log("📥 طلب تحديث جديد للمستخدم رقم:", id);
    console.log("📝 الاسم المرسل:", username);
    console.log("📝 النبذة المرسلة:", bio);
    console.log("🖼️ طول نص الصورة المرسلة:", avatar ? avatar.length + " حرف" : "لا توجد صورة");
    console.log("====================================");

    const prismaAny = prisma as any;
    
    // محاولة الحفظ في قاعدة البيانات
    const updatedUser = await prismaAny.user.update({
      where: { id: id },
      data: {
        username: username,
        bio: bio,
        avatar: avatar
      }
    });

    console.log("✅ تم الحفظ في قاعدة البيانات بنجاح!");
    res.json(updatedUser);

  } catch (error: any) {
    // 💥 هنا سيتم طباعة السبب الحقيقي الذي يجعل السيرفر يرفض الصورة
    console.error("💥 السيرفر يصرخ من هذا الخطأ الداخلي:", error);
    res.status(500).json({ message: "فشل التحديث", details: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, avatar: true, bio: true, createdAt: true }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // بحث مباشر وبسيط بالنص كما هو في الرابط
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, username: true, role: true, avatar: true, bio: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserNovels = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const prismaAny = prisma as any;
    const novels = await prismaAny.novel.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(novels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};