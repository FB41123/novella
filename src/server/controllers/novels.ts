import { Request, Response } from 'express';
import prisma from '../prisma/client';

// جلب الروايات المنشورة فقط للعامة
export const getAllNovels = async (req: any, res: any) => {
  try {
    const prismaAny = prisma as any;
    const novels = await prismaAny.novel.findMany({
      where: { 
        isPublished: true // 🚀 هذا السطر يمنع ظهور المسودات في الرئيسية!
      },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(novels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNovelById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const prismaAny = prisma as any;
    
    const novel = await prismaAny.novel.findUnique({
      where: { id },
      include: { 
        author: true,
        chapters: true,
        characters: true,
        // 🚀 السطر السحري لجلب التعليقات وصور أصحابها ترتيباً من الأحدث للأقدم
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!novel) {
      return res.status(404).json({ message: "الرواية غير موجودة" });
    }

    res.json(novel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createNovel = async (req: any, res: any) => {
  try {
    // 🚀 أضفنا originalAuthor و sourceUrl هنا
    const { title, description, coverImage, tags, status, isPublished, originalAuthor, sourceUrl } = req.body;
    const authorId = req.user?.id || req.user?.userId;

    const prismaAny = prisma as any;
    const newNovel = await prismaAny.novel.create({
      data: {
        title,
        description,
        coverImage,
        tags: tags || "فانتازيا",
        status: status || "ongoing",
        isPublished: isPublished !== undefined ? isPublished : false,
        originalAuthor, // حفظ الكاتب الأصلي
        sourceUrl,      // حفظ الرابط
        authorId,
        views: 0
      }
    });

    res.status(201).json(newNovel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNovel = async (req: any, res: Response) => {
  const { id } = req.params;
  
  // 🚀 التعديل هنا: أضفنا originalAuthor و sourceUrl للبيانات المستلمة
  const { title, description, coverImage, tags, status, originalAuthor, sourceUrl } = req.body;
  
  try {
    const novel = await prisma.novel.findUnique({ where: { id } });
    if (!novel) return res.status(404).json({ message: 'Novel not found' });
    
    if (novel.authorId !== (req.user?.id || req.user) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // 🚀 التعديل هنا: أضفنا الحقلين لدالة الـ update ليتم حفظهما في الداتا بيس
    const updated = await prisma.novel.update({
      where: { id },
      data: { 
        title, 
        description, 
        coverImage, 
        tags, 
        status,
        originalAuthor, // حفظ اسم الكاتب الجديد
        sourceUrl       // حفظ الرابط الجديد
      }
    });
    
    res.json(updated);
  } catch (error: any) {
    console.error("Error updating novel:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteNovel = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const novel = await prisma.novel.findUnique({ where: { id } });
    if (!novel) return res.status(404).json({ message: 'Novel not found' });
    if (novel.authorId !== (req.user?.id || req.user) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await prisma.novel.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error: any) {
    console.error("Error deleting novel:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// دالة تغيير حالة الرواية (نشر / إخفاء)
export const togglePublishStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const prismaAny = prisma as any;
    
    const updatedNovel = await prismaAny.novel.update({
      where: { id },
      data: { isPublished }
    });
    
    res.json({ message: isPublished ? "تم النشر بنجاح!" : "تمت الإعادة كمسودة", novel: updatedNovel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// جلب كل الروايات للمدير (بما فيها المسودات)
export const getAdminNovels = async (req: any, res: any) => {
  try {
    const prismaAny = prisma as any;
    const novels = await prismaAny.novel.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(novels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// تغيير حالة النشر للرواية (نشر/إخفاء)
export const togglePublish = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const prismaAny = prisma as any;

    // جلب الرواية لمعرفة حالتها الحالية
    const novel = await prismaAny.novel.findUnique({ where: { id } });
    if (!novel) return res.status(404).json({ message: "الرواية غير موجودة" });

    // عكس الحالة (إذا كانت منشورة نخفيها، وإذا مخفية ننشرها)
    const updatedNovel = await prismaAny.novel.update({
      where: { id },
      data: { isPublished: !novel.isPublished }
    });

    res.json(updatedNovel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};