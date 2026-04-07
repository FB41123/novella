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
  ShieldCheck // 👑 أيقونة الإدارة العليا الجديدة
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  // القائمة الأساسية التي تظهر للجميع (قراء، كتاب، مدراء)
  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: Globe, label: "المجتمع", path: "/community" },
    { icon: BookMarked, label: t('nav.library') || "مكتبتي", path: "/library" }, 
    { icon: MessageCircle, label: t('nav.messages'), path: "/messages" },
    { icon: User, label: t('nav.profile'), path: `/profile/${user.id}` },
    { icon: Settings, label: t('nav.settings'), path: "/settings" },
  ];

  // 📝 إضافة زر لوحة التحكم الخاصة بـ "الكاتب" العادي
  if (user.role === "writer") {
    navItems.splice(1, 0, { icon: LayoutDashboard, label: t('nav.dashboard') || "لوحة التحكم", path: "/dashboard" });
  }

  // 👑 إضافة زر لوحة الإدارة العليا الخاصة بـ "المدير" (أنت)
  if (user.role === "admin") {
    navItems.splice(1, 0, { icon: ShieldCheck, label: "لوحة الإدارة العليا 👑", path: "/admin" });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {navItems.map((item) => {
            // تمييز زر الإدارة العليا بلون مختلف ليكون فخماً
            const isAdminBtn = item.path === "/admin";
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3", 
                    isActive(item.path) && "font-bold",
                    isAdminBtn && "text-primary hover:bg-primary/10 border-r-4 border-primary rounded-none" // تصميم مميز لزر الإدارة
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
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="h-5 w-5" />
          {t('nav.logout')}
        </Button>
      </div>
    </aside>
  );
}