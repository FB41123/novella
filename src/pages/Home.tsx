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
        const res = await fetch("http://localhost:3000/api/novels");
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
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      
      {/* 🌟 قسم الترحيب (Hero Section) */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-5 bg-gradient-to-b from-primary/10 to-transparent p-8 rounded-3xl border border-primary/5">
        <h1 className="text-4xl md:text-6xl font-black text-primary flex items-center justify-center gap-3 drop-shadow-sm">
          <BookOpen className="w-10 h-10 md:w-14 md:h-14 text-primary" />
          مرحباً بك في Novella
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
          اكتشف أروع الروايات، وعش مغامرات لا تُنسى في عوالم خيالية صُنعت خصيصاً لك.
        </p>
      </div>

      {/* 📚 عنوان قسم الروايات */}
      <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-4">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2">
           المكتبة العامة
        </h2>
      </div>

      {/* 📥 عرض الروايات */}
      {isLoading ? (
        <div className="text-center py-32 text-primary text-xl font-bold animate-pulse">جاري تحميل العوالم... ⏳</div>
      ) : novels.length === 0 ? (
        <div className="text-center py-24 bg-secondary/5 rounded-3xl border border-primary/10">
          <h3 className="text-2xl font-bold text-muted-foreground mb-3">لا توجد روايات منشورة حالياً</h3>
          <p className="text-muted-foreground">الكتّاب والإدارة يعملون بشغف على تجهيز القصص، عُد قريباً! ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} to={`/novel/${novel.id}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border-primary/10 group cursor-pointer h-full flex flex-col bg-card rounded-2xl">
                
                {/* الغلاف */}
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-secondary/10">
                  <img 
                    src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} 
                    alt={novel.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* شارة الحالة (مستمرة/مكتملة) */}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary flex items-center gap-1.5 shadow-sm border border-primary/10">
                    <Clock className="w-3.5 h-3.5" /> {novel.status === "completed" ? "مكتملة" : "مستمرة"}
                  </div>
                </div>

                {/* تفاصيل الرواية */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-xl text-primary mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{novel.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{novel.description}</p>
                  </div>
                  
                  {/* اسم الكاتب / المصدر */}
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/20 p-2.5 rounded-lg border border-primary/5">
                    {novel.originalAuthor ? (
                      <><Globe className="w-4 h-4 text-blue-500" /> <span className="truncate">{novel.originalAuthor}</span></>
                    ) : (
                      <><User className="w-4 h-4 text-primary" /> <span className="truncate">{novel.author?.username || "الإدارة"}</span></>
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