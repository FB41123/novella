import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// استيراد مسارات الـ API
import interactionRoutes from './src/server/routes/interactions';
import authRoutes from './src/server/routes/auth';
import userRoutes from './src/server/routes/users';
import postRoutes from './src/server/routes/posts';
import novelRoutes from './src/server/routes/novels';
import chapterRoutes from './src/server/routes/chapters';
import messageRoutes from './src/server/routes/messages';
import settingsRoutes from './src/server/routes/settings';
import { setupSockets } from './src/server/sockets';
import characterRoutes from './src/server/routes/characters';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  // 1. إعداد الـ CORS الذكي: يقبل اللوكال هوست والروابط المحددة فقط
  const corsOptions = {
    origin: function (origin: any, callback: any) {
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://novella-seven.vercel.app', process.env.FRONTEND_URL];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };

  // تطبيق الـ CORS على الـ Sockets والـ Express
  const io = new Server(httpServer, { cors: corsOptions });
  setupSockets(io);
  app.use(cors(corsOptions));

  // Security middlewares
  app.use(helmet());
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter);

  app.use(express.json({ limit: '2mb' })); 
  app.use(express.urlencoded({ limit: '2mb', extended: true }));

  // 2. مسارات الـ API
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/novels', novelRoutes);
  app.use('/api/chapters', chapterRoutes);
  app.use('/api/characters', characterRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/interactions', interactionRoutes);

  // 3. مسار رئيسي بسيط عشان لو فتحت رابط السيرفر تتأكد إنه شغال
  app.get('/', (req, res) => {
    res.json({ message: "Novella API is running successfully! 🚀" });
  });

  // 🚀 Keep-Alive health check - يُستخدم لمنع Render من تنويم السيرفر
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();