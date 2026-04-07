import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getMessages = async (req: any, res: Response) => {
  const { userId } = req.params;
  
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        receiver: { select: { id: true, username: true, avatar: true } }
      }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: any, res: Response) => {
  const { receiverId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content
      },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        receiver: { select: { id: true, username: true, avatar: true } }
      }
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
