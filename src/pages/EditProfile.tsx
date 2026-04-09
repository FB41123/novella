import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowRight, Loader2, Camera, UserCircle } from "lucide-react";
import imageCompression from 'browser-image-compression';

export function EditProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // للتحكم بزر اختيار الملف
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "" // هنا سنحفظ الصورة كنص مشفر
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://novella-api.onrender.com/api/users/${user?.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            username: data.username || "",
            bio: data.bio || "",
            avatar: data.avatar || ""
          });
        }
      } catch (error) {
        console.error("خطأ:", error);
      } finally {
        setIsFetching(false);
      }
    };
    if (user?.id) fetchMyData();
  }, [user]);


// ---------------------------------------------------------

  // 🚀 دالة تحويل وضغط الصورة المرفوعة
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // إعدادات الضغط: نصغر الصورة إلى 1 ميجابايت كحد أقصى وبأبعاد مناسبة للويب
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      // أمر الضغط السحري (يتم في جهاز المستخدم قبل الإرسال)
      const compressedFile = await imageCompression(file, options);

      // بعد الضغط، نحولها إلى نص Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      console.error("حدث خطأ أثناء ضغط الصورة:", error);
      alert("فشل ضغط الصورة، يرجى المحاولة بصورة أخرى.");
    }
  };

  // 🚀 دالة الإرسال للسيرفر
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!user?.id) {
        throw new Error("لم يتم العثور على معرف المستخدم، يرجى تسجيل الدخول مجدداً.");
      }

      const payload = {
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar 
      };

      const res = await fetch(`https://novella-api.onrender.com/api/users/${user.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "فشل التحديث من جهة السيرفر");
      }
      
      // ✅ تم حل المشكلة هنا: أزلنا الكود الخاطئ واستبدلناه بإعادة تحميل آمنة
      alert("✅ تم تحديث بياناتك بنجاح!");
      navigate(`/profile/${user.id}`);
      window.location.reload(); // يجبر المتصفح على جلب الصورة والاسم الجديد وتحديث الشريط العلوي

    } catch (error: any) {
      console.error("تفاصيل الخطأ:", error);
      alert("❌ خطأ: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl animate-in fade-in duration-300">
      <Button variant="ghost" className="mb-6 gap-2 hover:bg-secondary/20" onClick={() => navigate(-1)}>
        <ArrowRight className="w-4 h-4" /> العودة للملف الشخصي
      </Button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-foreground mb-2 flex justify-center items-center gap-2">
          <UserCircle className="w-8 h-8 text-primary" /> إعدادات الهوية
        </h1>
      </div>

      <Card className="border-primary/10 shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* قسم رفع الصورة بشكل احترافي */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg overflow-hidden bg-secondary/30 flex items-center justify-center relative">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl text-primary font-bold">{formData.username?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                  {/* طبقة سوداء شفافة تظهر عند تمرير الماوس */}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white mb-1" />
                    <span className="text-white text-xs font-bold">تغيير الصورة</span>
                  </div>
                </div>
              </div>
              {/* زر إدخال الملف المخفي */}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <p className="text-xs text-muted-foreground">اضغط على الدائرة لاختيار صورة (الحد الأقصى 3MB)</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-bold text-primary">الاسم الذي سيظهر للجميع</Label>
              <Input 
                required 
                className="h-14 text-lg bg-background border-primary/20 focus-visible:ring-primary" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-bold text-primary">نبذة عنك (Bio)</Label>
              <textarea 
                className="w-full min-h-[150px] p-4 border rounded-xl bg-background border-primary/20 focus:ring-2 focus:ring-primary outline-none resize-y text-lg leading-relaxed" 
                placeholder="تحدث عن نفسك، هواياتك..."
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gap-2 h-14 text-lg rounded-xl mt-8 shadow-md hover:shadow-lg transition-all">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ التغييرات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}