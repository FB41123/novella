import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNovelById } from "@/services/novels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Settings, ArrowRight, PlusCircle, Edit, Save, X, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ManageNovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);

  // --- مرجع لزر رفع الصورة ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  // --- حالات (States) تعديل الرواية ---
  const [isEditingNovel, setIsEditingNovel] = useState(false);
  const [novelForm, setNovelForm] = useState({ title: "", description: "", tags: "", status: "", coverImage: "" });

  // --- حالات (States) الفصول ---
  const [chapters, setChapters] = useState<any[]>([]);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [chapterForm, setChapterForm] = useState({ id: "", title: "", content: "", order: 1 });

  // --- حالات (States) الشخصيات ---
  const [characters, setCharacters] = useState<any[]>([]);
  const [showCharForm, setShowCharForm] = useState(false);
  const [charForm, setCharForm] = useState({ id: "", name: "", description: "" });

  // جلب البيانات
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        if (id) {
          const data: any = await getNovelById(id);
          
          // 🚀 الحارس الذكي: إذا كانت الرواية خارجية، حوّل المستخدم لصفحتها المخصصة فوراً!
          if (data.sourceUrl) {
            navigate(`/admin/edit-external/${id}`);
            return; // إيقاف تنفيذ باقي الكود هنا
          }

          setNovel(data);
          
          // تعبئة بيانات الرواية في نموذج التعديل
          setNovelForm({
            title: data.title,
            description: data.description,
            tags: data.tags || "فانتازيا",
            status: data.status || "ongoing",
            coverImage: data.coverImage || data.cover || ""
          });

          setChapters(data?.chapters || []);
          setCharacters(data?.characters || []);
        }
      } catch (error) {
        console.error("خطأ في جلب الرواية:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNovel();
  }, [id, navigate]);

  // ==========================================
  // دوال الحفظ (تتواصل مع السيرفر)
  // ==========================================

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً! الرجاء اختيار صورة أقل من 3 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovelForm({ ...novelForm, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateNovel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://novella-api.onrender.com/api/novels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(novelForm)
      });

      if (!res.ok) throw new Error("فشل في تحديث بيانات الرواية");
      
      const updatedNovel = await res.json();
      setNovel(updatedNovel); 
      setIsEditingNovel(false); 
      alert("✅ تم تحديث تفاصيل الرواية بنجاح!");
    } catch (error: any) {
      alert("❌ حدث خطأ: " + error.message);
    }
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
      const isEditing = !!chapterForm.id;
      const url = isEditing ? `https://novella-api.onrender.com/api/chapters/${chapterForm.id}` : `https://novella-api.onrender.com/api/chapters`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          novelId: id,
          title: chapterForm.title,
          content: chapterForm.content,
          order: Number(chapterForm.order)
        })
      });

      if (!res.ok) throw new Error("فشل في حفظ الفصل.");
      
      const savedChapter = await res.json();
      if (isEditing) setChapters(chapters.map(ch => ch.id === savedChapter.id ? savedChapter : ch));
      else setChapters([...chapters, savedChapter]);
      
      setShowChapterForm(false);
    } catch (error: any) {
      alert("❌ حدث خطأ: " + error.message);
    }
  };

  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const isEditing = !!charForm.id;
      const url = isEditing ? `https://novella-api.onrender.com/api/characters/${charForm.id}` : `https://novella-api.onrender.com/api/characters`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          novelId: id,
          name: charForm.name,
          description: charForm.description,
        })
      });

      if (!res.ok) throw new Error("فشل في حفظ الشخصية.");
      
      const savedChar = await res.json();
      if (isEditing) setCharacters(characters.map(c => c.id === savedChar.id ? savedChar : c));
      else setCharacters([...characters, savedChar]);
      
      setShowCharForm(false);
    } catch (error: any) {
      alert("⚠️ رسالة السيرفر: " + error.message);
    }
  };


  if (isLoading) return <div className="text-center py-20">جاري تحميل الغرفة السرية... ⏳</div>;
  if (!novel) return <div className="text-center py-20 text-red-500">الرواية غير موجودة!</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
     <Button variant="ghost" className="mb-6 gap-2 font-bold" onClick={() => navigate(user?.role === "admin" ? "/admin" : "/dashboard")}>
       <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
     </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <Card className="border-primary/20 shadow-sm overflow-hidden mb-4">
            <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} alt="cover" className="w-full h-48 object-cover" />
            <div className="p-4 bg-secondary/10">
              <h3 className="font-bold text-lg truncate">{novel.title}</h3>
              <p className="text-xs text-muted-foreground">{novel.status === "completed" ? "مكتملة ✅" : "مستمرة ✍️"}</p>
            </div>
          </Card>

          <Button variant={activeTab === "details" ? "secondary" : "ghost"} className="w-full justify-start gap-2" onClick={() => setActiveTab("details")}>
            <Settings className="w-4 h-4" /> تفاصيل الرواية
          </Button>
          <Button variant={activeTab === "chapters" ? "secondary" : "ghost"} className="w-full justify-start gap-2" onClick={() => setActiveTab("chapters")}>
            <BookOpen className="w-4 h-4" /> إدارة الفصول
          </Button>
          <Button variant={activeTab === "characters" ? "secondary" : "ghost"} className="w-full justify-start gap-2" onClick={() => setActiveTab("characters")}>
            <Users className="w-4 h-4" /> الشخصيات
          </Button>
        </aside>

        <main className="flex-1">
          <Card className="shadow-md border-primary/10 min-h-[500px]">
            <CardHeader className="border-b bg-secondary/5 mb-6">
              <CardTitle className="text-2xl text-primary">
                {activeTab === "details" && "إعدادات وتفاصيل الرواية ⚙️"}
                {activeTab === "chapters" && "فهرس الفصول 📚"}
                {activeTab === "characters" && "شخصيات العالم 🎭"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {activeTab === "details" && (
                <div className="space-y-6">
                  {!isEditingNovel ? (
                    <div className="space-y-4 relative">
                      <Button className="absolute top-0 left-0 gap-2" variant="outline" onClick={() => setIsEditingNovel(true)}>
                        <Edit className="w-4 h-4" /> تعديل البيانات
                      </Button>
                      
                      <h3 className="font-bold text-2xl pr-32 text-primary">{novel.title}</h3>
                      <p className="text-muted-foreground whitespace-pre-line bg-secondary/10 p-5 rounded-md leading-relaxed border border-primary/10">{novel.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-4">
                        <span className="bg-secondary/20 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2">
                          🏷️ التصنيف: {novel.tags}
                        </span>
                        <span className="bg-secondary/20 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2">
                          📌 الحالة: {novel.status === "completed" ? "مكتملة ✅" : "مستمرة ✍️"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateNovel} className="space-y-4 p-6 border rounded-xl bg-secondary/5">
                      <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="font-bold text-xl">تعديل بيانات الرواية</h3>
                        <Button type="button" variant="ghost" onClick={() => setIsEditingNovel(false)}><X className="w-5 h-5" /></Button>
                      </div>

                      <div className="flex flex-col items-center justify-center space-y-4 py-4 border-b border-primary/10">
                        <Label className="text-lg font-bold text-primary self-start">الغلاف الحالي</Label>
                        
                        <div 
                          className="w-48 h-64 border-4 border-dashed border-primary/20 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-secondary/20 relative group transition-all hover:border-primary/50 hover:shadow-xl"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {novelForm.coverImage ? (
                            <img src={novelForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-6 flex flex-col items-center gap-3">
                              <Camera className="w-12 h-12 text-primary/40" />
                              <span className="text-sm font-bold text-muted-foreground leading-tight">اضغط لرفع غلاف <br/> (الحد الأقصى 3MB)</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold bg-primary/80 px-4 py-2 rounded-full text-sm">تغيير الغلاف</span>
                          </div>
                        </div>
                        
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>اسم الرواية</Label>
                        <Input required value={novelForm.title} onChange={e => setNovelForm({...novelForm, title: e.target.value})} />
                      </div>

                      <div className="space-y-2">
                        <Label>النبذة (الوصف)</Label>
                        <textarea 
                          required 
                          className="w-full min-h-[150px] p-4 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-y"
                          value={novelForm.description}
                          onChange={e => setNovelForm({...novelForm, description: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>التصنيف</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={novelForm.tags} 
                            onChange={e => setNovelForm({...novelForm, tags: e.target.value})}
                          >
                            <option value="فانتازيا">فانتازيا 🪄</option>
                            <option value="رومانسي">رومانسي ❤️</option>
                            <option value="خيال علمي">خيال علمي 🚀</option>
                            <option value="رعب">رعب 👻</option>
                            <option value="غموض">غموض 🔍</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>حالة الرواية</Label>
                          <select 
                            className="w-full p-2 border rounded-md bg-background"
                            value={novelForm.status} 
                            onChange={e => setNovelForm({...novelForm, status: e.target.value})}
                          >
                            <option value="ongoing">مستمرة ✍️</option>
                            <option value="completed">مكتملة ✅</option>
                          </select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full gap-2 py-6 text-lg mt-4">
                        <Save className="w-5 h-5" /> حفظ التعديلات
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === "chapters" && (
                <div className="space-y-6">
                  {!showChapterForm ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">أضف ورتب فصول روايتك هنا.</p>
                        <Button className="gap-2 bg-primary" onClick={() => {
                          setChapterForm({ id: "", title: "", content: "", order: chapters.length + 1 });
                          setShowChapterForm(true);
                        }}>
                          <PlusCircle className="w-4 h-4" /> إضافة فصل جديد
                        </Button>
                      </div>
                      
                      {chapters.length === 0 ? (
                        <div className="border-2 border-dashed p-10 text-center rounded-xl bg-secondary/5">
                          <p className="text-muted-foreground">لا توجد فصول حالياً. ابدأ بكتابة الفصل الأول!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {chapters.sort((a, b) => a.order - b.order).map((ch) => (
                            <div key={ch.id} className="flex justify-between items-center p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow">
                              <div>
                                <h4 className="font-bold text-lg">الفصل {ch.order}: {ch.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">آخر تعديل: {new Date(ch.createdAt).toLocaleDateString()}</p>
                              </div>
                              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                                setChapterForm({ id: ch.id, title: ch.title, content: ch.content, order: ch.order });
                                setShowChapterForm(true);
                              }}>
                                <Edit className="w-4 h-4" /> تعديل
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={handleSaveChapter} className="space-y-4 p-6 border rounded-xl bg-secondary/5">
                      <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="font-bold text-xl">{chapterForm.id ? "تعديل الفصل" : "كتابة فصل جديد"}</h3>
                        <Button type="button" variant="ghost" onClick={() => setShowChapterForm(false)}><X className="w-5 h-5" /></Button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-3 space-y-2">
                          <Label>عنوان الفصل</Label>
                          <Input required value={chapterForm.title} onChange={e => setChapterForm({...chapterForm, title: e.target.value})} placeholder="مثال: البداية المظلمة..." />
                        </div>
                        <div className="col-span-1 space-y-2">
                          <Label>رقم الفصل</Label>
                          <Input type="number" min="1" required value={chapterForm.order} onChange={e => setChapterForm({...chapterForm, order: Number(e.target.value)})} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>محتوى الفصل</Label>
                        <textarea 
                          required 
                          className="w-full min-h-[300px] p-4 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none resize-y leading-relaxed text-lg" 
                          placeholder="اكتب أحداث الفصل هنا..."
                          value={chapterForm.content}
                          onChange={e => setChapterForm({...chapterForm, content: e.target.value})}
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2 py-6 text-lg">
                        <Save className="w-5 h-5" /> {chapterForm.id ? "حفظ التعديلات" : "نشر الفصل"}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === "characters" && (
                <div className="space-y-6">
                  {!showCharForm ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">أضف شخصيات روايتك ونبذة عنهم ليتذكرهم القراء.</p>
                        <Button className="gap-2 bg-primary" onClick={() => {
                          setCharForm({ id: "", name: "", description: "" });
                          setShowCharForm(true);
                        }}>
                          <PlusCircle className="w-4 h-4" /> إضافة شخصية
                        </Button>
                      </div>
                      
                      {characters.length === 0 ? (
                        <div className="border-2 border-dashed p-10 text-center rounded-xl bg-secondary/5">
                          <p className="text-muted-foreground">لا توجد شخصيات حالياً. أضف بطل الرواية أولاً!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {characters.map((char) => (
                            <div key={char.id} className="p-4 border rounded-lg bg-card hover:shadow-sm">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-primary">{char.name}</h4>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setCharForm({ id: char.id, name: char.name, description: char.description });
                                  setShowCharForm(true);
                                }}><Edit className="w-4 h-4" /></Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{char.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <form onSubmit={handleSaveCharacter} className="space-y-4 p-6 border rounded-xl bg-secondary/5">
                      <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h3 className="font-bold text-xl">{charForm.id ? "تعديل الشخصية" : "إضافة شخصية جديدة"}</h3>
                        <Button type="button" variant="ghost" onClick={() => setShowCharForm(false)}><X className="w-5 h-5" /></Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>اسم الشخصية</Label>
                        <Input required value={charForm.name} onChange={e => setCharForm({...charForm, name: e.target.value})} placeholder="مثال: جون سنو" />
                      </div>

                      <div className="space-y-2">
                        <Label>نبذة عن الشخصية (وصف بسيط)</Label>
                        <textarea 
                          className="w-full min-h-[120px] p-4 border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none" 
                          placeholder="مثال: شاب شجاع يبحث عن الحقيقة في عالم مليء بالأكاذيب..."
                          value={charForm.description}
                          onChange={e => setCharForm({...charForm, description: e.target.value})}
                        />
                      </div>

                      <Button type="submit" className="w-full gap-2 py-6">
                        <Save className="w-5 h-5" /> حفظ الشخصية
                      </Button>
                    </form>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}