// 🚀 Keep-Alive: يضرب ping للسيرفر كل 10 دقائق لمنعه من النوم (Render Free Plan)
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function startKeepAlive() {
  if (keepAliveInterval) return; // لا تشغل مرتين

  const ping = async () => {
    try {
      await fetch('https://novella-api.onrender.com/api/health', { 
        method: 'GET',
        cache: 'no-store'
      });
    } catch {
      // نتجاهل الأخطاء، الهدف فقط إبقاء السيرفر مستيقظاً
    }
  };

  // ping فوري عند تحميل الموقع
  ping();
  
  // ثم كل 10 دقائق (أقل من 15 دقيقة التي يضرب بها Render سيرفره)
  keepAliveInterval = setInterval(ping, 10 * 60 * 1000);
}

export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}
