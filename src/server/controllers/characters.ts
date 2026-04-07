import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createCharacter = async (req: any, res: Response) => {
  const { novelId, name, description } = req.body;
  try {
    // التأكد من أن الكاتب هو صاحب الرواية
    const novel = await prisma.novel.findUnique({ where: { id: novelId } });
    if (!novel) return res.status(404).json({ message: 'الرواية غير موجودة' });
    if (novel.authorId !== (req.user?.id || req.user) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بالإضافة لهذه الرواية' });
    }

    const character = await prisma.character.create({
      data: { novelId, name, description }
    });
    res.status(201).json(character);
  } catch (error: any) {
    console.error("💥 خطأ في إضافة الشخصية:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateCharacter = async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const character = await prisma.character.update({
      where: { id },
      data: { name, description }
    });
    res.json(character);
  } catch (error: any) {
    console.error("💥 خطأ في تعديل الشخصية:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteCharacter = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.character.delete({ where: { id } });
    res.json({ message: 'تم الحذف' });
  } catch (error: any) {
    console.error("💥 خطأ في حذف الشخصية:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};