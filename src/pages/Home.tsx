import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, Clock, Globe } from "lucide-react";

export function Home() {
  const [novels, setNovels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await fetch("https://novella-api.onrender.com/api/novels");
        if (res.ok) {
          const data = await res.json();
          // عرض الروايات المنشورة فقط للجمهور
          setNovels(data.filter((n: any) => n.isPublished !== false));
        }
      } catch (error) {
        console.error("خطأ في جلب الروايات:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNovels();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-10 animate-in fade-in duration-500">
      
      {/* 🌟 قسم الترحيب (Hero Section) - متجاوب مع الشاشات */}
      <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 space-y-4 md:space-y-6 bg-gradient-to-b from-primary/10 to-transparent p-6 md:p-12 rounded-[2rem] border border-primary/5 shadow-sm">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 drop-shadow-sm leading-tight">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-primary mb-2 sm:mb-0" />
          مرحباً بك في Novella
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto px-2">
          اكتشف أروع الروايات، وعش مغامرات لا تُنسى في عوالم خيالية صُنعت خصيصاً لك.
        </p>
      </div>

      {/* 📚 عنوان قسم الروايات */}
      <div className="mb-6 md:mb-10 flex items-center justify-between border-b border-primary/10 pb-3 md:pb-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-primary flex items-center gap-2">
           المكتبة العامة
        </h2>
      </div>

      {/* 📥 عرض الروايات */}
      {isLoading ? (
        <div className="text-center py-20 md:py-32 text-primary text-lg md:text-xl font-bold animate-pulse">جاري تحميل العوالم... ⏳</div>
      ) : novels.length === 0 ? (
        <div className="text-center py-16 md:py-24 px-4 bg-secondary/5 rounded-3xl border border-primary/10">
          <h3 className="text-xl md:text-2xl font-bold text-muted-foreground mb-3">لا توجد روايات منشورة حالياً</h3>
          <p className="text-sm md:text-base text-muted-foreground">الكتّاب والإدارة يعملون بشغف على تجهيز القصص، عُد قريباً! ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} to={novel.sourceUrl ? `/external-novel/${novel.id}` : `/novel/${novel.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border-primary/10 group cursor-pointer h-full flex flex-col bg-card rounded-xl md:rounded-2xl">
                
                {/* الغلاف */}
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-secondary/10">
                  <img 
                    src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} 
                    alt={novel.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* شارة الحالة (مستمرة/مكتملة) */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-background/90 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-primary flex items-center gap-1 md:gap-1.5 shadow-sm border border-primary/10">
                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> 
                    <span className="hidden sm:inline">{novel.status === "completed" ? "مكتملة" : "مستمرة"}</span>
                    <span className="sm:hidden">{novel.status === "completed" ? "✅" : "✍️"}</span>
                  </div>
                </div>

                {/* تفاصيل الرواية */}
                <CardContent className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base md:text-lg lg:text-xl text-primary mb-1 md:mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors" title={novel.title}>{novel.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2 leading-snug md:leading-relaxed">{novel.description}</p>
                  </div>
                  
                  {/* اسم الكاتب / المصدر */}
                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold text-muted-foreground bg-secondary/20 p-2 md:p-2.5 rounded-md md:rounded-lg border border-primary/5 mt-auto">
                    {novel.originalAuthor ? (
                      <><Globe className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" /> <span className="truncate">{novel.originalAuthor}</span></>
                    ) : (
                      <><User className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" /> <span className="truncate">{novel.author?.username || "الإدارة"}</span></>
                    )}
                  </div>
                </CardContent>

              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}