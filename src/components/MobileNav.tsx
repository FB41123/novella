import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  BookMarked,
  User,
  Menu,
  Settings,
  MessageCircle,
  Globe,
  LogOut,
  ShieldCheck,
  X,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  // الأزرار الرئيسية في الشريط السفلي
  const mainItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: BookMarked, label: "المكتبة", path: "/library" },
    { icon: User, label: "حسابي", path: `/profile/${user.id}` },
  ];

  // أزرار قائمة "المزيد"
  const moreItems = [
    ...(user.role === "admin" ? [{ icon: ShieldCheck, label: "لوحة الإدارة العليا", path: "/admin", color: "text-primary" }] : []),
    ...(user.role === "writer" ? [{ icon: LayoutDashboard, label: "لوحة تحكم الكاتب", path: "/dashboard", color: "text-foreground" }] : []),
    { icon: Settings, label: "الإعدادات", path: "/settings", color: "text-foreground" },
    { icon: MessageCircle, label: "المراسلة", path: "/messages", color: "text-muted-foreground" },
    { icon: Globe, label: "المجتمع", path: "/community", color: "text-muted-foreground" },
  ];

  return (
    <>
      {/* النافذة المنبثقة لقائمة "المزيد" */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-t border-border/50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 pb-8"
            >
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-bold text-lg">المزيد من الخيارات</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-secondary/50 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid gap-2">
                {moreItems.map((item) => (
                  <Link key={item.path} to={item.path} className="w-full">
                    <div className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors active:scale-95",
                      isActive(item.path) && "bg-secondary"
                    )}>
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      <span className={cn("font-semibold", item.color)}>{item.label}</span>
                    </div>
                  </Link>
                ))}

                <button 
                  onClick={logout}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors mt-2 active:scale-95 w-full text-right"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold">تسجيل الخروج</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* الشريط السفلي الرئيسي */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {mainItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full relative group">
                <div className="relative">
                  <item.icon className={cn("w-6 h-6 transition-all duration-300", active ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground")} />
                  {active && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    />
                  )}
                </div>
                <span className={cn("text-[10px] font-bold transition-all duration-300", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full relative group"
          >
            <Menu className={cn("w-6 h-6 transition-all duration-300 text-muted-foreground group-hover:text-foreground", isMenuOpen && "text-primary scale-110")} />
            <span className={cn("text-[10px] font-bold transition-all duration-300", isMenuOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
              المزيد
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
