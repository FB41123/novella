import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getNovels } from "@/services/novels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, MessageSquare, Info, ArrowRight, Loader2, UserPlus, CalendarDays, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FollowButton } from "@/components/ui/FollowButton";

export function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userNovels, setUserNovels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("novels");

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!userRes.ok) {
          setProfileUser(null);
          setIsLoading(false);
          return;
        }

        const userData = await userRes.json();
        setProfileUser(userData);

        if (userData.role !== 'writer') setActiveTab("posts");

        if (userData.role === 'writer') {
          const allNovels = await getNovels();
          const hisNovels = allNovels.filter((n: any) => n.authorId === id);
          setUserNovels(hisNovels);
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-primary/50" /></div>;
  if (!profileUser) return <div className="text-center py-32 text-red-500 font-bold text-2xl">المستخدم غير موجود!</div>;

  const isMyProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* زر العودة العلوي */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
          <ArrowRight className="w-4 h-4" /> عودة
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* ========================================= */}
        {/* قسم الهوية (نظيف ومودرن) */}
        {/* ========================================= */}
        <div className="flex flex-col items-center text-center mb-12">
          
          {/* الصورة الشخصية بإطار أنيق */}
          <div className="relative mb-6 group">
            <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg overflow-hidden bg-secondary/30 flex items-center justify-center z-10 relative">
  {profileUser?.avatar ? (
    <img src={profileUser.avatar} alt="Profile" className="w-full h-full object-cover" />
  ) : (
    <span className="text-5xl text-primary font-bold">
      {profileUser?.username?.charAt(0).toUpperCase() || "U"}
    </span>
  )}
</div>
            {/* مؤشر متصل (أونلاين وهمي للجمالية) */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-background rounded-full"></div>
          </div>
          
          {/* الاسم واللقب */}
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2 flex items-center gap-2">
            {profileUser.username}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${profileUser.role === 'writer' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-600'}`}>
              {profileUser.role === 'writer' ? '✍️ كاتب' : '📖 قارئ'}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <CalendarDays className="w-4 h-4" /> انضم في {new Date(profileUser.createdAt).getFullYear()}
            </span>
          </div>

          {/* النبذة */}
          <p className="text-muted-foreground max-w-lg leading-relaxed mb-8 text-base md:text-lg">
            {profileUser.bio || "لا توجد نبذة شخصية حتى الآن. هذا المستخدم يفضل الغموض."}
          </p>
          
          {/* أزرار التفاعل (نظيفة جداً) */}
          {/* أزرار التفاعل (نظيفة جداً) */}
          <div className="flex gap-4 w-full md:w-auto justify-center">
            {isMyProfile ? (
              <Button onClick={() => navigate('/edit-profile')} variant="outline" className="gap-2 px-8 py-6 rounded-full shadow-sm hover:shadow-md transition-all">
                <Edit3 className="w-4 h-4" /> تعديل الملف الشخصي
              </Button>
            ) : (
              <>
                <Button 
                  onClick={async () => {
                    // دالة المتابعة المباشرة
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/follow", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify({ followingId: profileUser.id })
                      });
                      if (res.ok) {
                         alert(profileUser.role === 'writer' ? 'تمت إضافة الكاتب لمكتبتك ✅' : 'تمت إضافة الصديق لمكتبتك ✅');
                      }
                    } catch (err) { console.error(err); }
                  }}
                  className="gap-2 px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-base"
                >
                  <UserPlus className="w-5 h-5" /> {profileUser.role === 'writer' ? 'متابعة الكاتب' : 'إضافة كصديق'}
                </Button>
                
                <Button variant="outline" size="icon" className="w-14 h-14 rounded-full border-primary/20 hover:bg-secondary shadow-sm">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* التبويبات الحديثة (ستايل تويتر/انستجرام) */}
        {/* ========================================= */}
        <div className="flex justify-center border-b border-border/60 mb-8 overflow-x-auto hide-scrollbar">
          {profileUser.role === 'writer' && (
            <button
              onClick={() => setActiveTab("novels")}
              className={`relative px-8 py-4 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === "novels" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <BookOpen className="w-4 h-4" /> أعمالي
              {activeTab === "novels" && <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          )}
          <button
            onClick={() => setActiveTab("posts")}
            className={`relative px-8 py-4 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === "posts" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare className="w-4 h-4" /> المنشورات والتفاعل
            {activeTab === "posts" && <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`relative px-8 py-4 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === "about" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Info className="w-4 h-4" /> حول
            {activeTab === "about" && <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
        </div>

        {/* ========================================= */}
        {/* مساحة عرض المحتوى */}
        {/* ========================================= */}
        <div className="min-h-[300px] animate-in fade-in duration-500">
          
          {/* تبويب الروايات */}
          {activeTab === "novels" && profileUser.role === 'writer' && (
            <div>
              {userNovels.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">لا توجد روايات منشورة حتى الآن.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userNovels.map((novel) => (
                    <Link key={novel.id} to={`/novel/${novel.id}`}>
                      <Card className="border-none shadow-none bg-transparent group cursor-pointer h-full">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-sm mb-3">
                          <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" className="rounded-full">قراءة</Button>
                          </div>
                        </div>
                        <h3 className="font-bold text-foreground line-clamp-1 text-center group-hover:text-primary transition-colors">{novel.title}</h3>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* تبويب المنشورات */}
          {activeTab === "posts" && (
            <div className="text-center py-20">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">ساحة النقاش فارغة حالياً.</p>
            </div>
          )}

          {/* تبويب حول */}
          {activeTab === "about" && (
            <Card className="bg-secondary/10 border-none shadow-sm rounded-2xl max-w-2xl mx-auto">
              <CardContent className="p-8 text-center md:text-right">
                <h3 className="font-bold text-xl mb-4">نبذة تفصيلية</h3>
                <p className="text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                  {profileUser.bio || "لم يقم المستخدم بكتابة تفاصيل إضافية عنه."}
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}