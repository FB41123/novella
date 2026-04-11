import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // 👈 أضفنا استدعاء مكتبة PWA هنا

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // 🚀 إعدادات تحويل الموقع لتطبيق (PWA)
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Novella - عالم الروايات',    // 👈 1. هنا تغير الاسم الطويل للتطبيق
          short_name: 'Novella',              // 👈 2. هنا الاسم القصير اللي يظهر تحت أيقونة الجوال
          description: 'منصتك المفضلة لقراءة وكتابة الروايات العربية',
          theme_color: '#4f46e5',             // لون الشريط العلوي في الجوال (حطيته لون أساسي كحلي)
          background_color: '#ffffff',        // لون خلفية شاشة التحميل
          display: 'standalone',              // عشان يفتح كأنه تطبيق بدون شريط متصفح
          icons: [
            {
              src: 'pwa-192x192.png',         // 👈 3. اسم الصورة الأولى
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',         // 👈 4. اسم الصورة الثانية عالية الدقة
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});