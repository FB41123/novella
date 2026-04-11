import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Home,
  Globe, 
  BookMarked, 
  LayoutDashboard,
  MessageCircle,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  X // 🚀 أضفنا علامة الإغلاق للجوال
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  
  // 🚀 حالة فتح وإغلاق القائمة في الجوال
  const [isOpen, setIsOpen] = useState(false);

  // 🚀 الاستماع لزر الثلاث خطوط اللي في الهيدر
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggleMobileMenu', handleToggle);
    return () => window.removeEventListener('toggleMobileMenu', handleToggle);
  }, []);

  // 🚀 إغلاق القائمة تلقائياً بمجرد اختيار صفحة (الانتقال لرابط جديد)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  // القائمة الأساسية
  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: Globe, label: "المجتمع", path: "/community" },
    { icon: BookMarked, label: t('nav.library') || "مكتبتي", path: "/library" }, 
    { icon: MessageCircle, label: t('nav.messages'), path: "/messages" },
    { icon: User, label: t('nav.profile'), path: `/profile/${user.id}` },
    { icon: Settings, label: t('nav.settings'), path: "/settings" },
  ];

  if (user.role === "writer") {
    navItems.splice(1, 0, { icon: LayoutDashboard, label: t('nav.dashboard') || "لوحة التحكم", path: "/dashboard" });
  }

  if (user.role === "admin") {
    navItems.splice(1, 0, { icon: ShieldCheck, label: "لوحة الإدارة العليا 👑", path: "/admin" });
  }

  return (
    <>
      {/* 🚀 الخلفية الشفافة (Overlay) تظهر في الجوال خلف القائمة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🚀 القائمة الجانبية (متجاوبة: تنزلق في الجوال، وثابتة في الكمبيوتر) */}
      <aside className={cn(
        "fixed md:sticky top-0 md:top-16 right-0 md:right-auto z-[70] md:z-0 flex flex-col w-64 border-l md:border-l-0 md:border-r bg-card h-screen md:h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        
        {/* رأس القائمة في الجوال (يحتوي على اسم الموقع وزر الإغلاق) */}
        <div className="flex md:hidden items-center justify-between p-4 border-b">
          <span className="font-black text-primary text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Novella</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-muted-foreground" />
          </Button>
        </div>

        {/* محتوى القائمة (الأزرار) */}
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isAdminBtn = item.path === "/admin";
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 transition-all", 
                      isActive(item.path) && "font-bold shadow-sm",
                      isAdminBtn && "text-primary hover:bg-primary/10 border-r-4 border-primary rounded-none",
                      !isActive(item.path) && "hover:translate-x-[-4px]" // تأثير حركة ناعم عند التأشير
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* زر تسجيل الخروج في الأسفل */}
        <div className="p-4 border-t mb-4 md:mb-0">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 font-bold" onClick={logout}>
            <LogOut className="h-5 w-5" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>
    </>
  );
}