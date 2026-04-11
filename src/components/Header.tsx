import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User, PenTool, BookOpen, LogOut, MessageCircle, Menu, Globe } from "lucide-react"; // أضفنا Globe
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage, dir } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
        
        {/* 🌟 القسم الأيمن (الشعار والقائمة) */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* زر القائمة الجانبية العامة (يظهر في الجوال) */}
        <Button variant="ghost" size="icon" className="md:hidden w-8 h-8 sm:w-10 sm:h-10" onClick={() => window.dispatchEvent(new Event('toggleMobileMenu'))}>
  <Menu className="h-5 w-5 text-primary" />
</Button>
          
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 font-black text-lg md:text-xl hover:opacity-80 transition-opacity">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            {/* الشعار يختفي في الشاشات الصغيرة جداً ويبقى الرمز فقط */}
            <span className="hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Novella
            </span>
          </Link>
        </div>

        {/* 🌟 القسم الأيسر (الأدوات وحساب المستخدم) */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          
          {/* زر اللغة (ذكي: أيقونة واختصار في الجوال، نص كامل في الكمبيوتر) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
            className="font-bold px-2 sm:px-3 gap-1 md:gap-2 h-8 md:h-10 text-muted-foreground hover:text-primary"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
            <span className="md:hidden">{language === 'ar' ? 'EN' : 'AR'}</span>
          </Button>

          {/* زر الثيم (الوضع الليلي/النهاري) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-secondary/80 w-8 h-8 md:w-10 md:h-10 flex-shrink-0 text-muted-foreground hover:text-primary"
          >
            <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('settings.theme')}</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 border-l border-primary/10 pl-1 sm:pl-2 md:pl-3 ml-1 sm:ml-2">
              
              {/* زر الرسائل */}
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/80 w-8 h-8 md:w-10 md:h-10 flex-shrink-0 relative text-muted-foreground hover:text-primary">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  {/* نقطة التنبيه (اختيارية للجمال) */}
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background hidden md:block"></span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {/* 🚀 الصورة الشخصية (متجاوبة) */}
                <Link to={`/profile/${user.id}`}>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-primary/20 bg-secondary/50 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 shadow-sm cursor-pointer flex-shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm md:text-lg text-primary font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </Link>

                {/* زر تسجيل الخروج */}
                <Button variant="ghost" size="icon" onClick={logout} className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 w-8 h-8 md:w-10 md:h-10 flex-shrink-0 text-muted-foreground">
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-2 ml-1">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold text-xs md:text-sm h-8 md:h-10 px-2 md:px-4">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-bold shadow-md text-xs md:text-sm h-8 md:h-10 px-3 md:px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full md:rounded-md">
                  {t('auth.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}