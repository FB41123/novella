import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getChapter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        novel: { select: { id: true, title: true, authorId: true } }
      }
    });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createChapter = async (req: any, res: Response) => {
  const { novelId, title, content, order } = req.body;
  try {
    const novel = await prisma.novel.findUnique({ where: { id: novelId } });
    if (!novel) return res.status(404).json({ message: 'Novel not found' });
    if (novel.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const chapter = await prisma.chapter.create({
      data: {
        novelId,
        title,
        content,
        order
      }
    });
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
