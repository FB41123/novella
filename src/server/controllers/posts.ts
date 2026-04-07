import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        likes: true,
        comments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req: any, res: Response) => {
  const { content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: req.user.id
      },
      include: {
        author: { select: { id: true, username: true, avatar: true } }
      }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const likePost = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: req.user.id
        }
      }
    });

    if (existingLike) {
      await prisma.postLike.delete({ where: { id: existingLike.id } });
      return res.json({ message: 'Unliked' });
    }

    await prisma.postLike.create({
      data: {
        postId: id,
        userId: req.user.id
      }
    });
    res.json({ message: 'Liked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const commentPost = async (req: any, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.postComment.create({
      data: {
        postId: id,
        userId: req.user.id,
        content
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } }
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
