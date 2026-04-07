import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'اسم المستخدم أو البريد الإلكتروني مسجل مسبقاً في النظام' });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'reader'
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
  } catch (error: any) {
    // 💥 هنا فضحنا الخطأ! سيظهر في الشاشة السوداء بالتفصيل
    console.error("💥 خطأ أثناء عملية التسجيل:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar }, token });
  } catch (error: any) {
    // 💥 هنا فضحنا الخطأ!
    console.error("💥 خطأ أثناء تسجيل الدخول:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar });
  } catch (error: any) {
    console.error("💥 خطأ في جلب بيانات المستخدم:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};