import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  MessageCircle,
  Globe,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MoreMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const moreItems = [
    ...(user.role === "admin" ? [{ icon: ShieldCheck, label: "لوحة الإدارة العليا", path: "/admin", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" }] : []),
    ...(user.role === "writer" ? [{ icon: LayoutDashboard, label: "لوحة تحكم الكاتب", path: "/dashboard", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400" }] : []),
    { icon: Settings, label: "الإعدادات", path: "/settings", color: "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300" },
    { icon: MessageCircle, label: "المراسلة", path: "/messages", color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
    { icon: Globe, label: "المجتمع", path: "/community", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:hidden animate-in fade-in duration-300 min-h-screen pb-24">
      <h1 className="text-2xl font-black mb-8 text-foreground">القائمة</h1>
      
      <div className="flex flex-col gap-3">
        {moreItems.map((item) => (
          <Link key={item.path} to={item.path} className="w-full">
            <div className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        ))}

        <button 
          onClick={logout}
          className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl shadow-sm transition-all active:scale-95 mt-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl text-red-600 bg-red-100 dark:bg-red-900/40">
              <LogOut className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg text-red-600">تسجيل الخروج</span>
          </div>
        </button>
      </div>
    </div>
  );
}
