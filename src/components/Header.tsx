import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, PenTool, BookOpen, LogOut, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage, dir } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Novella</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
            className="font-medium"
          >
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-secondary/80"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('settings.theme')}</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-2">
                {/* 🚀 السحر هنا: عرض الصورة الشخصية أو الحرف الأول */}
                <Link to={`/profile/${user.id}`}>
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-secondary/50 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 shadow-sm cursor-pointer">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg text-primary font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </Link>

                <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-bold shadow-md">{t('auth.register')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}