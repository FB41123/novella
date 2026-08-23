import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, BookMarked, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path || (path === "/more" && location.pathname === "/more");

  // الأزرار الرئيسية في الشريط السفلي
  const mainItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: BookMarked, label: "المكتبة", path: "/library" },
    { icon: User, label: "حسابي", path: `/profile/${user.id}` },
    { icon: Menu, label: "المزيد", path: "/more" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-1">
        {mainItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center gap-1 w-full h-full group">
              <div 
                className={cn(
                  "p-1.5 rounded-full transition-all duration-300", 
                  active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 scale-110" : "text-muted-foreground group-hover:bg-secondary/50 group-hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span 
                className={cn(
                  "text-[10px] sm:text-xs font-bold transition-all duration-300", 
                  active ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
