import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Plus, Globe, Database, Trash2, LayoutDashboard, Book, Users, Settings, Edit , Eye, EyeOff} from "lucide-react";

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allNovels, setAllNovels] = useState<any[]>([]);
  // 1. استخدام الذاكرة المؤقتة لتذكر التبويب
  const [activeTab, setActiveTab] = useState(sessionStorage.getItem("adminActiveTab") || "overview");

  // 2. تحديث الذاكرة كلما تغير التبويب
  useEffect(() => {
    sessionStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // 3. دالة النشر/الإخفاء السريعة
  const handleTogglePublish = async (novelId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/novels/${novelId}/publish`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const updatedNovel = await res.json();
        // تحديث حالة الرواية في الجدول فوراً بدون إعادة تحميل الصفحة
        setAllNovels(allNovels.map(n => n.id === novelId ? { ...n, isPublished: updatedNovel.isPublished } : n));
      }
    } catch (error) {
      alert("حدث خطأ أثناء تغيير حالة النشر");
    }
  };

  useEffect(() => {
    // جلب كل الروايات الموجودة في المنصة
  const fetchAllNovels = async () => {
      try {
        const token = localStorage.getItem("token"); // جلب بطاقة الهوية
        // استخدام الرابط الجديد الخاص بالمدير
        const res = await fetch("http://localhost:3000/api/novels/admin/all", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAllNovels(data);
        }
      } catch (error) {
        console.error("خطأ في جلب الروايات:", error);
      }
    };
    fetchAllNovels();
  }, []);

  // الحماية: طرد أي شخص ليس أدمن
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-20 h-20 text-red-500" />
        <h1 className="text-3xl font-bold text-red-600">منطقة محظورة!</h1>
        <p className="text-muted-foreground">هذه الغرفة مخصصة للإدارة العليا فقط.</p>
        <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* ================= السايد بار (Sidebar) ================= */}
        <aside className="w-full md:w-64 space-y-2 flex-shrink-0">
          <div className="mb-8 px-4 border-b pb-6">
            <h2 className="text-2xl font-black text-primary flex items-center gap-2">
              <Database className="w-6 h-6" /> الإدارة العليا
            </h2>
            <p className="text-sm text-muted-foreground mt-1">غرفة التحكم المركزية</p>
          </div>
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            className="w-full justify-start gap-3 shadow-sm font-bold transition-all"
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="h-5 w-5" /> نظرة عامة
          </Button>
          <Button 
            variant={activeTab === "novels" ? "default" : "ghost"} 
            className="w-full justify-start gap-3 shadow-sm font-bold transition-all"
            onClick={() => setActiveTab("novels")}
          >
            <Book className="h-5 w-5" /> إدارة المحتوى
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 opacity-50 cursor-not-allowed font-bold"
          >
            <Users className="h-5 w-5" /> الأعضاء (قريباً)
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 opacity-50 cursor-not-allowed font-bold"
          >
            <Settings className="h-5 w-5" /> الإعدادات (قريباً)
          </Button>
        </aside>

        {/* ================= مساحة العمل (Main Content) ================= */}
        <main className="flex-1 space-y-8">
          
          {/* 👑 الترحيب الملكي مع الحركات (Animations) */}
          <div className="bg-gradient-to-r from-primary to-primary/60 p-8 md:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-top-8 duration-700">
            {/* زخرفة خلفية شفافة */}
            <div className="absolute top-0 left-0 opacity-10 transform -translate-x-10 -translate-y-10">
              <ShieldCheck size={250} />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black mb-3 drop-shadow-md">
                أهلاً بك، المدير {user?.username} 👋
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl font-medium mb-8 max-w-2xl">
                إمبراطوريتك تعمل بكفاءة، وجميع الصلاحيات العليا تحت تصرفك الآن. ماذا ننجز اليوم؟
              </p>
              
              {/* أزرار الإجراءات السريعة */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/admin/create-novel" className="flex-1 sm:flex-none">
                  <Button className="w-full gap-2 font-bold shadow-lg h-14 px-8 bg-white text-primary hover:bg-gray-100 transition-transform hover:scale-105 text-lg rounded-xl">
                    <Globe className="w-5 h-5" /> جلب رواية خارجية (نشر فوري)
                  </Button>
                </Link>
                <Link to="/create-novel" className="flex-1 sm:flex-none">
  <Button variant="outline" className="w-full gap-2 font-bold h-14 px-8 border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white transition-transform hover:scale-105 text-lg rounded-xl">
    <Plus className="w-5 h-5" /> إنشاء مسودة يدوياً
  </Button>
</Link>
              </div>
            </div>
          </div>

          {/* تبويب النظرة العامة */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both">
              <Card className="shadow-md border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <Book className="w-4 h-4 text-primary" /> إجمالي الروايات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-primary">{allNovels.length}</div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" /> الروايات المنشورة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-green-600">
                    {allNovels.filter(n => n.isPublished).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" /> الأعضاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-blue-600">--</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* تبويب إدارة المحتوى */}
          {activeTab === "novels" && (
            <div className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="p-6 border-b border-primary/5 bg-secondary/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">قاعدة بيانات الروايات</h2>
              </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-secondary/20 border-b">
                    <tr>
                      <th className="p-4 font-bold text-muted-foreground whitespace-nowrap">اسم الرواية</th>
                      <th className="p-4 font-bold text-muted-foreground whitespace-nowrap text-center">الكاتب/المصدر</th>
                      <th className="p-4 font-bold text-muted-foreground whitespace-nowrap text-center">الحالة</th>
                      <th className="p-4 font-bold text-muted-foreground whitespace-nowrap text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allNovels.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-muted-foreground font-bold text-lg">
                          لا توجد روايات في المنصة حتى الآن. ابدأ بجلب بعض الروايات!
                        </td>
                      </tr>
                    ) : (
                      allNovels.map(novel => (
                        <tr key={novel.id} className="border-b border-primary/5 last:border-0 hover:bg-secondary/10 transition-colors">
                          <td className="p-4 font-bold text-primary flex items-center gap-4 min-w-[200px]">
                            <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0 shadow-sm border border-primary/10">
                              <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/50"} className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-[200px]">{novel.title}</span>
                          </td>
                          <td className="p-4 text-sm font-medium text-center">
                            {novel.originalAuthor ? (
                              <span className="text-blue-600 inline-flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"><Globe className="w-3 h-3"/> {novel.originalAuthor}</span>
                            ) : (
                              <span className="text-muted-foreground">{novel.author?.username || "الإدارة"}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold ${novel.isPublished ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                              {novel.isPublished ? 'منشورة 🌍' : 'مسودة 📝'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-3">
                              <Button 
                                variant={novel.isPublished ? "secondary" : "default"} 
                                size="sm" 
                                className={`gap-1 shadow-sm transition-colors w-24 ${novel.isPublished ? 'hover:bg-yellow-100 hover:text-yellow-700' : 'bg-green-600 hover:bg-green-700 text-white'}`} 
                                onClick={() => handleTogglePublish(novel.id)}
                              >
                                {novel.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {novel.isPublished ? 'إخفاء' : 'نشر'}
                              </Button>

                              <Button variant="outline" size="sm" className="gap-2 shadow-sm hover:bg-primary hover:text-white transition-colors px-4" onClick={() => navigate(`/manage-novel/${novel.id}`)}>
                                <Edit className="w-4 h-4" /> إدارة
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}