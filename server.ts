import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  
  // 1. تحديد الـ CORS للـ Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://novella-seven.vercel.app", "http://localhost:5173"], 
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  setupSockets(io);

  // 2. تحديد الـ CORS لطلبات الـ Express
  app.use(cors({
    origin: ["https://novella-seven.vercel.app", "http://localhost:5173"],
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' })); 
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/novels', novelRoutes);
  app.use('/api/chapters', chapterRoutes);
  app.use('/api/characters', characterRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/interactions', interactionRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();