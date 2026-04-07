import { Response } from 'express';
import prisma from '../prisma/client';

const getUserId = (req: any) => {
  if (!req.user) return null;
  if (typeof req.user === 'string') return req.user;
  return req.user.id || req.user.userId || (req.user.user && req.user.user.id) || null;
};

export const toggleFavorite = async (req: any, res: Response) => {
  try {
    const userId = getUserId(req);
    const { novelId } = req.body;
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const prismaAny = prisma as any; // 👈 هذا هو السحر الذي يسكت الخطوط الحمراء
    const existing = await prismaAny.novelFavorite.findUnique({
      where: { userId_novelId: { userId, novelId } }
    });

    if (existing) {
      await prismaAny.novelFavorite.delete({ where: { id: existing.id } });
      return res.json({ message: 'تمت الإزالة من المفضلة', isFavorite: false });
    } else {
      await prismaAny.novelFavorite.create({ data: { userId, novelId } });
      return res.json({ message: 'تمت الإضافة للمفضلة', isFavorite: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFollow = async (req: any, res: Response) => {
  try {
    const followerId = getUserId(req);
    const { followingId } = req.body;
    
    if (!followerId) return res.status(401).json({ message: "غير مصرح" });
    if (followerId === followingId) return res.status(400).json({ message: 'لا يمكنك متابعة نفسك!' });

    const prismaAny = prisma as any;
    const existing = await prismaAny.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });

    if (existing) {
      await prismaAny.follow.delete({ where: { id: existing.id } });
      return res.json({ message: 'تم إلغاء المتابعة', isFollowing: false });
    } else {
      await prismaAny.follow.create({ data: { followerId, followingId } });
      return res.json({ message: 'تمت المتابعة', isFollowing: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyLibrary = async (req: any, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "غير مصرح" });

    const prismaAny = prisma as any;

    const favorites = await prismaAny.novelFavorite.findMany({
      where: { userId },
      include: { novel: true }
    });

    const following = await prismaAny.follow.findMany({
      where: { followerId: userId },
      include: { following: true }
    });

    res.json({
      favorites: favorites.map((f: any) => f.novel).filter(Boolean),
      following: following.map((f: any) => f.following).filter(Boolean)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// إضافة أو إزالة الإعجاب (Like 👍)
export const toggleLike = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { novelId } = req.body;
    if (!userId) return res.status(401).json({ message: "يجب تسجيل الدخول" });

    const prismaAny = prisma as any;
    const existing = await prismaAny.novelLike.findUnique({
      where: { userId_novelId: { userId, novelId } }
    });

    if (existing) {
      await prismaAny.novelLike.delete({ where: { id: existing.id } });
      return res.json({ message: 'تم إزالة الإعجاب', isLiked: false });
    } else {
      await prismaAny.novelLike.create({ data: { userId, novelId } });
      return res.json({ message: 'تم الإعجاب بالرواية', isLiked: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// إضافة تعليق جديد (Comment 💬)
export const addComment = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { novelId, content } = req.body;
    if (!userId) return res.status(401).json({ message: "يجب تسجيل الدخول" });

    const prismaAny = prisma as any;
    const newComment = await prismaAny.comment.create({
      data: { content, userId, novelId },
      include: { user: { select: { username: true, avatar: true } } } // جلب اسم وصورة المعلق
    });

    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

