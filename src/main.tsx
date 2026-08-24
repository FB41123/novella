import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { registerSW } from 'virtual:pwa-register';
import { startKeepAlive } from './services/keepAlive';

// تحديث التطبيق تلقائياً عند وجود نسخة جديدة
registerSW({ immediate: true });

// 🚀 Keep-Alive: يبقي السيرفر مستيقظاً لتجنب Cold Start
startKeepAlive();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
