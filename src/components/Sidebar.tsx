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
      {/* 🚀 القائمة الجانبية (مخفية في الجوال، ثابتة في الكمبيوتر) */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card sticky top-16 h-[calc(100vh-4rem)] z-0">

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