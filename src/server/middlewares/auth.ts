import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// تأكد أن هذا المفتاح هو نفسه المستخدم عند تسجيل الدخول (Login)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// تعريف نوع الطلب ليتضمن بيانات المستخدم
export interface AuthRequest extends Request {
  user?: any; // استخدمنا any هنا لتجنب التعارضات البرمجية السريعة
}

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'الجلسة منتهية، يرجى تسجيل الدخول مجدداً' });
    }
    // حفظ بيانات المستخدم في الطلب لاستخدامها لاحقاً
    req.user = user;
    next();
  });
};

export const requireRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح لك' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية الوصول' });
    }

    next();
  };
};