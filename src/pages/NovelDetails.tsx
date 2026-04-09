import { useState, useEffect, FormEvent } from "react";import { useParams, useNavigate, Link } from "react-router-dom";
import { getNovelById } from "@/services/novels";
import { useAuth } from "@/context/AuthContext"; // استيراد للتحقق من المستخدم الحالي
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Heart, ArrowRight, List, Users, User, MessageSquare, Loader2, BookmarkPlus, BookmarkCheck, ThumbsUp, Send } from "lucide-react";

export function NovelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // لمعرفة من هو المستخدم الذي سيعلق
  
  const [novel, setNovel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chapters"); 
  
  // حالات الأزرار التفاعلية
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // حالات التعليقات
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        if (id) {
          const data : any =  await getNovelById(id);
          setNovel(data);
          setComments(data.comments || []);
          
          // (اختياري) إذا كان السيرفر يرسل حالة إعجاب/مفضلة المستخدم الحالي، يمكنك تعيينها هنا
          // setIsFavorite(data.isFavoritedByCurrentUser);
          // setIsLiked(data.isLikedByCurrentUser);
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNovel();
  }, [id]);

  // دالة الإضافة/الإزالة من المفضلة (مكتبتي)
  const handleFavorite = async () => {
    if (!user) return alert("❌ يرجى تسجيل الدخول أولاً للإضافة إلى المفضلة.");
    setIsFavLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ novelId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      alert("❌ حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setIsFavLoading(false);
    }
  };

  // دالة الإعجاب (دعم الكاتب)
  const handleLike = async () => {
    if (!user) return alert("❌ يرجى تسجيل الدخول لدعم الكاتب بإعجاب.");
    setIsLikeLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/like", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ novelId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      alert("❌ حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // دالة إرسال التعليق
  const submitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return alert("❌ يرجى تسجيل الدخول لتتمكن من التعليق.");
    if (!newComment.trim()) return;

    setIsCommentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ novelId: id, content: newComment })
      });
      if (res.ok) {
        const savedComment = await res.json();
        setComments([savedComment, ...comments]); // إضافة التعليق الجديد أعلى القائمة
        setNewComment(""); // تفريغ الحقل
      }
    } catch (error) {
      alert("❌ حدث خطأ أثناء إرسال التعليق.");
    } finally {
      setIsCommentLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-32 text-xl font-bold text-primary animate-pulse">جاري تحميل العالم... ⏳</div>;
  if (!novel) return <div className="text-center py-32 text-red-500 font-bold text-2xl">الرواية غير موجودة!</div>;

  const sortedChapters = novel.chapters?.sort((a: any, b: any) => a.order - b.order) || [];
  const firstChapter = sortedChapters[0];

  return (
    <div className="min-h-screen bg-secondary/5 pb-12">
      {/* الغلاف العلوي العريض */}
      <div className="relative w-full h-64 md:h-80 bg-primary/90 overflow-hidden">
        <div className="absolute inset-0 opacity-30 blur-xl scale-110 bg-center bg-cover" style={{ backgroundImage: `url(${novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-4 h-full relative flex items-end pb-6">
          <Button variant="outline" className="absolute top-6 right-4 gap-2 bg-background/50 backdrop-blur border-none hover:bg-background/80" onClick={() => navigate(-1)}>
            <ArrowRight className="w-4 h-4" /> العودة
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* صورة الغلاف المصغرة */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <Card className="overflow-hidden shadow-2xl border-4 border-background rounded-xl">
              <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} alt={novel.title} className="w-full h-auto object-cover aspect-[2/3]" />
            </Card>
          </div>

          {/* تفاصيل وأزرار الرواية */}
          <div className="flex-1 pt-4 md:pt-28 text-center md:text-right">
            <h1 className="text-3xl md:text-5xl font-black text-primary mb-4 leading-tight">{novel.title}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6 text-sm font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100"><User className="w-4 h-4" /> {novel.author?.username || "مجهول"}</span>
              <span className="flex items-center gap-1.5 bg-secondary/30 text-primary px-3 py-1.5 rounded-md"><BookOpen className="w-4 h-4" /> {novel.tags}</span>
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-100"><Clock className="w-4 h-4" /> {novel.status === "completed" ? "مكتملة" : "مستمرة"}</span>
            </div>

            {/* الأزرار التفاعلية العريضة والمنظمة */}
            <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 mt-8">
              
              {/* زر القراءة */}
              {firstChapter ? (
                <Link to={`/novel/${novel.id}/chapter/${firstChapter.id}`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-lg hover:shadow-primary/20 transition-all gap-2 h-14 rounded-xl font-bold">
                    <BookOpen className="w-5 h-5" /> ابدأ القراءة
                  </Button>
                </Link>
              ) : (
                <Button size="lg" disabled className="w-full sm:w-auto text-lg px-8 opacity-70 h-14 rounded-xl font-bold">انتظر الفصل الأول</Button>
              )}

              <div className="flex gap-3 w-full sm:w-auto">
                {/* زر المفضلة (مكتبتي) */}
                <Button 
                  onClick={handleFavorite}
                  disabled={isFavLoading}
                  variant={isFavorite ? "default" : "outline"}
                  className={`flex-1 sm:flex-none h-14 px-6 gap-2 font-bold rounded-xl shadow-sm transition-all border-primary/20 hover:bg-primary hover:text-white`}
                >
                  {isFavLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />)}
                  <span className="hidden sm:inline">{isFavorite ? "في المكتبة" : "أضف للمكتبة"}</span>
                </Button>
                
                {/* زر الإعجاب (اللايك) */}
                <Button 
                  onClick={handleLike}
                  disabled={isLikeLoading}
                  variant="outline"
                  className={`flex-1 sm:flex-none h-14 px-6 gap-2 font-bold rounded-xl shadow-sm transition-all border-red-200 hover:bg-red-50 hover:text-red-600 ${isLiked ? 'bg-red-50 text-red-600 border-red-300' : 'text-muted-foreground'}`}
                >
                  {isLikeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />}
                  <span className="hidden sm:inline">{isLiked ? "أعجبتني" : "إعجاب"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* قسم التبويبات (فصول، شخصيات، تعليقات) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* العمود الجانبي للنبذة */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-primary/10 shadow-sm bg-card/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 text-primary border-b pb-3">عن الرواية</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">{novel.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* العمود الرئيسي للتبويبات */}
          <div className="md:col-span-2 space-y-6">
            
            {/* أزرار التبويبات */}
            <div className="flex flex-wrap gap-2 border-b border-primary/10 pb-3">
              <Button variant={activeTab === "chapters" ? "default" : "ghost"} className="gap-2 rounded-xl font-bold" onClick={() => setActiveTab("chapters")}>
                <List className="w-4 h-4" /> الفهرس ({sortedChapters.length})
              </Button>
              <Button variant={activeTab === "characters" ? "default" : "ghost"} className="gap-2 rounded-xl font-bold" onClick={() => setActiveTab("characters")}>
                <Users className="w-4 h-4" /> الشخصيات
              </Button>
              <Button variant={activeTab === "comments" ? "default" : "ghost"} className="gap-2 rounded-xl font-bold" onClick={() => setActiveTab("comments")}>
                <MessageSquare className="w-4 h-4" /> التعليقات ({comments.length})
              </Button>
            </div>
            
            {/* محتوى تبويب الفصول */}
            {activeTab === "chapters" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {sortedChapters.length === 0 ? (
                   <div className="text-center py-10 bg-secondary/10 rounded-xl text-muted-foreground font-medium">لم يقم الكاتب بنشر أي فصول بعد.</div>
                ) : (
                  sortedChapters.map((ch: any) => (
                    <Link key={ch.id} to={`/novel/${novel.id}/chapter/${ch.id}`}>
                      <Card className="hover:bg-primary/5 transition-colors border-primary/10 shadow-sm hover:shadow-md cursor-pointer group rounded-xl">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-primary/20 group-hover:text-primary/40 transition-colors w-8 text-center">{ch.order}</span>
                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{ch.title}</h4>
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:translate-x-[-5px] transition-transform">
                            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            )}
            
            {/* محتوى تبويب الشخصيات */}
            {activeTab === "characters" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {(!novel.characters || novel.characters.length === 0) ? (
                   <div className="col-span-full text-center py-10 bg-secondary/10 rounded-xl text-muted-foreground font-medium">لا توجد شخصيات مضافة للرواية حتى الآن.</div>
                ) : (
                  novel.characters?.map((char: any) => (
                    <Card key={char.id} className="border-primary/10 shadow-sm bg-card/50 rounded-xl">
                      <CardContent className="p-5">
                        <h4 className="font-bold text-lg text-primary mb-2 flex items-center gap-2"><User className="w-4 h-4" /> {char.name}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{char.description}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* محتوى تبويب التعليقات الجديد 🚀 */}
            {activeTab === "comments" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* حقل كتابة التعليق */}
                <Card className="border-primary/10 shadow-sm rounded-xl overflow-hidden">
                  <form onSubmit={submitComment} className="p-1 bg-secondary/5 relative">
                    <textarea 
                      placeholder={user ? "شاركنا رأيك في هذه الرواية..." : "يجب تسجيل الدخول لتتمكن من التعليق..."}
                      disabled={!user || isCommentLoading}
                      className="w-full min-h-[100px] p-4 bg-transparent outline-none resize-y text-base font-medium disabled:opacity-50"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end p-2 border-t border-border/50 bg-background">
                      <Button type="submit" disabled={!user || isCommentLoading || !newComment.trim()} className="gap-2 rounded-lg font-bold">
                        {isCommentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        إرسال التعليق
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* قائمة التعليقات */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-10 bg-secondary/10 rounded-xl text-muted-foreground font-medium">كن أول من يشارك رأيه في هذه الرواية! 💬</div>
                  ) : (
                    comments.map((comment: any, index: number) => (
                      <div key={index} className="flex gap-4 p-4 border-b border-primary/5 last:border-0 bg-card rounded-xl shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0 border border-primary/10">
                          {comment.user?.avatar ? (
                            <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                              {comment.user?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="font-bold text-sm text-primary">{comment.user?.username || "قارئ"}</h5>
                            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-card-foreground">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}