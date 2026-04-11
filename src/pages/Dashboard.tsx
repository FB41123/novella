import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNovels } from "@/services/novels"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Book, BarChart, Settings, BookOpen, Globe, Lock, Edit, Menu, X } from "lucide-react"; // أضفنا Menu و X
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("novels");
  const [myNovels, setMyNovels] = useState<any[]>([]); 
  
  // 🚀 حالة جديدة للتحكم بفتح/إغلاق القائمة في الجوال
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchMyNovels = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`https://novella-api.onrender.com/api/users/${user.id}/novels`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          
          if (res.ok) {
             const data = await res.json();
             setMyNovels(data);
          } else {
             const allNovels = await getNovels();
             setMyNovels(allNovels.filter((n: any) => n.authorId === user.id));
          }
        } catch (error) {
           console.error("Error fetching novels:", error);
        }
      }
    };
    fetchMyNovels();
  }, [user]);

  const handleTogglePublish = async (novelId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://novella-api.onrender.com/api/novels/${novelId}/publish`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ isPublished: !currentStatus }) 
      });

      if (res.ok) {
        setMyNovels(prev => prev.map(novel => 
          novel.id === novelId ? { ...novel, isPublished: !currentStatus } : novel
        ));
        alert(!currentStatus ? "🌍 تم نشر الرواية للجمهور بنجاح!" : "🔒 تمت إعادة الرواية كمسودة سرية.");
      } else {
        alert("❌ حدث خطأ، تأكد من تعديل ملفات السيرفر.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ في الاتصال بالسيرفر");
    }
  };

  if (!user || user.role !== "writer") {
    return <div className="container mx-auto py-20 text-center">{t('dashboard.accessDenied')}</div>;
  }

  // 🚀 دالة لاختيار التبويب وإغلاق القائمة الجانبية (في الجوال) تلقائياً
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 animate-in fade-in duration-500 min-h-screen">
      
      {/* 🚀 زر إظهار القائمة الجانبية (للجوال فقط) */}
      <div className="md:hidden flex items-center justify-between bg-card p-4 rounded-xl shadow-sm mb-6 border border-primary/10">
        <h2 className="text-xl font-black text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5"/> {t('dashboard.writerStudio')}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        
        {/* 🚀 الخلفية الشفافة (Overlay) للجوال */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 🚀 القائمة الجانبية (Sidebar) المتجاوبة */}
        <aside className={`
          fixed md:relative top-0 right-0 h-full md:h-auto w-64 bg-background md:bg-transparent z-50 p-6 md:p-0 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out border-l md:border-l-0 border-primary/10
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full rtl:translate-x-full md:translate-x-0 rtl:md:translate-x-0"}
        `}>
          {/* رأس القائمة الجانبية في الجوال */}
          <div className="flex justify-between items-center mb-8 md:hidden">
             <h2 className="text-xl font-black text-primary">القائمة</h2>
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
               <X className="w-6 h-6" />
             </Button>
          </div>

          <div className="hidden md:block mb-6 px-4 border-b pb-4">
            <h2 className="text-xl font-black text-primary flex items-center gap-2">
               <BookOpen className="w-5 h-5"/> {t('dashboard.writerStudio')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t('dashboard.manageStories')}</p>
          </div>

          <div className="space-y-2">
            <Button 
              variant={activeTab === "novels" ? "default" : "ghost"} 
              className="w-full justify-start gap-3 shadow-sm"
              onClick={() => handleTabClick("novels")}
            >
              <Book className="h-4 w-4" /> {t('dashboard.myNovels')}
            </Button>
            <Button 
              variant={activeTab === "stats" ? "default" : "ghost"} 
              className="w-full justify-start gap-3 shadow-sm"
              onClick={() => handleTabClick("stats")}
            >
              <BarChart className="h-4 w-4" /> {t('dashboard.analytics')}
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start gap-3 shadow-sm"
              onClick={() => handleTabClick("settings")}
            >
              <Settings className="h-4 w-4" /> {t('nav.settings')}
            </Button>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 w-full overflow-hidden">
          {activeTab === "novels" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-primary/10">
                <h1 className="text-xl sm:text-2xl font-bold">{t('dashboard.myNovels')}</h1>
                <Link to="/create-novel" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all h-10 px-6">
                    <Plus className="h-4 w-4" /> إنشاء رواية
                  </Button>
                </Link>
              </div>

              <div className="grid gap-6">
                {myNovels.map((novel) => (
                  <Card key={novel.id} className="flex flex-col sm:flex-row overflow-hidden shadow-md hover:shadow-lg transition-all border-primary/10 group">
                    <div className="w-full sm:w-48 h-64 sm:h-auto bg-muted flex-shrink-0 border-r relative">
                      <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                         <span className={`px-3 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1 backdrop-blur-md ${
                           novel.isPublished ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-white"
                         }`}>
                           {novel.isPublished ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                           {novel.isPublished ? 'منشورة' : 'مسودة'}
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between bg-card/50">
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                          <h3 className="text-xl sm:text-2xl font-black text-primary leading-tight line-clamp-2">{novel.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex-shrink-0 border ${
                            novel.status === "completed" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-orange-50 text-orange-700 border-orange-200"
                          }`}>
                            {novel.status === "completed" ? "مكتملة ✅" : "مستمرة ✍️"}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 mb-4 text-sm leading-relaxed">{novel.description}</p>
                        <div className="flex gap-3 text-xs font-bold text-muted-foreground bg-secondary/30 p-2 rounded-lg w-fit border border-border/50">
                          <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md shadow-sm">👁️ {novel.views || 0}</span>
                          <span className="flex items-center gap-1 bg-background px-2 py-1 rounded-md shadow-sm">❤️ {novel.likes || 0}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 border-t border-border/50 pt-5">
                        {novel.sourceUrl ? (
                          <Link to={`/admin/edit-external/${novel.id}`} className="col-span-1">
                            <Button className="w-full gap-2 shadow-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                              <Edit className="w-4 h-4" /> تعديل
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/manage-novel/${novel.id}`} className="col-span-1">
                            <Button className="w-full gap-2 shadow-sm font-bold">
                              <Settings className="w-4 h-4" /> إدارة الفصول
                            </Button>
                          </Link>
                        )}
                        
                        <Link to={`/novel/${novel.id}`} className="col-span-1">
                          <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 font-bold">
                            <BookOpen className="w-4 h-4" /> عرض
                          </Button>
                        </Link>

                        <Button 
                           onClick={() => handleTogglePublish(novel.id, novel.isPublished)}
                           variant={novel.isPublished ? "outline" : "default"}
                           className={`col-span-1 gap-2 font-bold shadow-sm transition-all ${
                             !novel.isPublished 
                               ? 'bg-green-600 hover:bg-green-700 text-white' 
                               : 'border-red-200 text-red-600 hover:bg-red-50'
                           }`}
                        >
                           {novel.isPublished ? (
                             <><Lock className="w-4 h-4"/> إخفاء</>
                           ) : (
                             <><Globe className="w-4 h-4"/> نشر</>
                           )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {myNovels.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-primary/20 rounded-2xl bg-secondary/5">
                    <BookOpen className="w-16 h-16 text-primary/40 mx-auto mb-6 opacity-80" />
                    <h3 className="text-2xl font-black mb-3 text-primary">لا توجد روايات بعد</h3>
                    <p className="text-muted-foreground mb-8 text-sm sm:text-lg">ابدأ رحلتك الإبداعية واكتب روايتك الأولى الآن!</p>
                    <Link to="/create-novel">
                      <Button size="lg" className="shadow-xl text-lg h-14 px-8 rounded-full hover:scale-105 transition-transform w-full sm:w-auto">إنشاء روايتك الأولى 🚀</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold">{t('dashboard.analytics')}</h1>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t('dashboard.totalViews')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">0</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t('dashboard.totalLikes')}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">0</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">المتابعون</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">0</div></CardContent></Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
             <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold">{t('nav.settings')}</h1>
                <Card>
                   <CardHeader>
                      <CardTitle>الملف الشخصي</CardTitle>
                      <CardDescription>إعدادات حسابك ككاتب</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid gap-2">
                         <Label>الاسم المستعار</Label>
                         <Input defaultValue={user?.username} />
                      </div>
                      <div className="grid gap-2">
                         <Label>النبذة (Bio)</Label>
                         <Input defaultValue="هذا هو حسابي الرسمي للكتابة." />
                      </div>
                   </CardContent>
                   <div className="p-6 pt-0">
                      <Button className="w-full sm:w-auto">حفظ التعديلات</Button>
                   </div>
                </Card>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}