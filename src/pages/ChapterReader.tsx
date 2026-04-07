import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getNovelById } from "@/services/novels";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function ChapterReader() {
  // نستقبل الـ IDs الحقيقية من الرابط
  const { novelId, chapterId } = useParams<{ novelId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // إعدادات القارئ
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [showSettings, setShowSettings] = useState(false);

  // بيانات السيرفر
  const [novel, setNovel] = useState<any>(null);
  const [chapter, setChapter] = useState<any>(null);
  const [sortedChapters, setSortedChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب البيانات الحقيقية من الباك اند
  useEffect(() => {
    const fetchNovelAndChapter = async () => {
      setIsLoading(true);
      try {
        if (novelId && chapterId) {
const data: any = await getNovelById(novelId);          setNovel(data);
          
          // ترتيب الفصول لمعرفة السابق والتالي
          const chaptersList = data.chapters?.sort((a: any, b: any) => a.order - b.order) || [];
          setSortedChapters(chaptersList);
          
          // تحديد الفصل الحالي
          const currentChapter = chaptersList.find((ch: any) => ch.id === chapterId);
          setChapter(currentChapter);
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0); // رفع الشاشة لأعلى عند فتح فصل جديد
      }
    };
    fetchNovelAndChapter();
  }, [novelId, chapterId]);

  if (isLoading) return <div className="container mx-auto py-32 text-center text-xl font-bold text-primary animate-pulse">جاري تجهيز صفحات الفصل... ⏳</div>;
  if (!novel || !chapter) return <div className="container mx-auto py-32 text-center text-red-500 font-bold text-2xl">{t('reader.chapterNotFound') || 'الفصل غير موجود'}</div>;

  // منطق التنقل (التالي والسابق)
  const currentIndex = sortedChapters.findIndex((ch) => ch.id === chapter.id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  const handlePrev = () => {
    if (prevChapter) navigate(`/novel/${novelId}/chapter/${prevChapter.id}`);
  };

  const handleNext = () => {
    if (nextChapter) navigate(`/novel/${novelId}/chapter/${nextChapter.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* رأس القارئ (العلوي) */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to={`/novel/${novelId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-semibold">
            <ArrowRight className="h-5 w-5" />
            <span className="hidden sm:inline">العودة للرواية</span>
          </Link>
          
          <div className="font-bold text-sm md:text-base truncate max-w-[200px] sm:max-w-md text-primary">
            {novel.title} - الفصل {chapter.order}
          </div>
          
          {/* زر الإعدادات */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-secondary/20" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5 text-primary" />
            </Button>
            
            {showSettings && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 rounded-xl border border-primary/20 bg-card p-5 shadow-xl text-card-foreground">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-primary mb-2 block">حجم الخط</label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(14, fontSize - 2))}>A-</Button>
                      <span className="flex-1 text-center font-bold text-lg">{fontSize}px</span>
                      <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(32, fontSize + 2))}>A+</Button>
                    </div>
                  </div>
                  <div className="border-t border-primary/10 pt-4">
                    <label className="text-sm font-bold text-primary mb-2 block">نوع الخط</label>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={fontFamily === "serif" ? "default" : "outline"} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setFontFamily("serif")}
                      >
                        تقليدي (Serif)
                      </Button>
                      <Button 
                        variant={fontFamily === "sans" ? "default" : "outline"} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setFontFamily("sans")}
                      >
                        عصري (Sans)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* محتوى الفصل */}
      <div className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-12 text-center text-primary" style={{ fontFamily: fontFamily === "serif" ? "serif" : "sans-serif" }}>
          {chapter.title}
        </h1>
        
        <div 
          className={cn(
            "prose prose-lg dark:prose-invert mx-auto leading-[2.5] text-justify whitespace-pre-line text-foreground/90",
            fontFamily === "serif" ? "font-serif" : "font-sans"
          )}
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.content}
        </div>

        {/* أزرار التنقل السفلية */}
        <div className="flex justify-between items-center mt-20 pt-8 border-t border-primary/10">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={!prevChapter}
            className="gap-2 px-6 py-6 text-base shadow-sm hover:shadow-md hover:border-primary/50"
          >
            <ChevronRight className="h-5 w-5" /> الفصل السابق
          </Button>
          
          <div className="text-sm font-bold text-muted-foreground px-4 py-2 bg-secondary/20 rounded-full">
            {currentIndex + 1} / {sortedChapters.length}
          </div>
          
          <Button 
            onClick={handleNext} 
            disabled={!nextChapter}
            className="gap-2 px-6 py-6 text-base bg-primary text-primary-foreground shadow-sm hover:shadow-md"
          >
            الفصل التالي <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}