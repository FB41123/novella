import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const { siteName, description, defaultLanguage, values } = req.body;
  try {
    const first = await prisma.siteSettings.findFirst();
    
    if (first) {
      const updated = await prisma.siteSettings.update({
        where: { id: first.id },
        data: { siteName, description, defaultLanguage, values }
      });
      return res.json(updated);
    }

    const created = await prisma.siteSettings.create({
      data: { siteName, description, defaultLanguage, values }
    });
    res.json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
