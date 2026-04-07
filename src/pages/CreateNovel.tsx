import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createNovel } from "@/services/novels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BookOpen, ImageIcon, Info, Camera, Loader2, ArrowRight } from "lucide-react";

export function CreateNovel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("فانتازيا");
  const [status, setStatus] = useState("ongoing");
  const [coverImage, setCoverImage] = useState<string>(""); 

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً! الرجاء اختيار صورة أقل من 3 ميجابايت.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const newNovel = await createNovel({
        title,
        description,
        tags: category,
        status,
        coverImage: coverImage || "https://via.placeholder.com/300x450?text=No+Cover",
        authorId: user?.id,
        isPublished: false, 
        views: 0
      } as any);
      
      alert("✅ تم حفظ روايتك كمسودة بنجاح!");
      navigate(`/manage-novel/${newNovel.id}`); 
    } catch (error: any) {
      console.error("تفاصيل الخطأ:", error);
      const backendError = error.response?.data?.message || error.message;
      alert("❌ حدث خطأ: " + backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl animate-in fade-in duration-500">
      
      {/* زر الرجوع */}
      <Button variant="ghost" className="mb-6 gap-2 hover:bg-secondary/20" onClick={() => navigate(-1)}>
        <ArrowRight className="w-4 h-4" /> العودة
      </Button>

      <Card className="shadow-2xl border-primary/10 overflow-hidden">
        <CardHeader className="bg-primary/5 border-b pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-primary">إصدار رواية جديدة</CardTitle>
              <CardDescription className="text-base mt-1 font-medium">
                عالمك يبدأ هنا. سيتم حفظ الرواية كـ <span className="text-primary font-bold">مسودة</span>.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 p-8">
            
            <div className="flex flex-col items-center justify-center space-y-4 py-4 border-b">
              <Label className="text-lg font-bold text-primary self-start flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> غلاف الرواية
              </Label>
              
              <div 
                className="w-48 h-64 border-4 border-dashed border-primary/20 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-secondary/20 relative group transition-all hover:border-primary/50 hover:shadow-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {coverImage ? (
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center gap-3">
                    <Camera className="w-12 h-12 text-primary/40" />
                    <span className="text-sm font-bold text-muted-foreground leading-tight">اضغط لرفع غلاف</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold bg-primary/80 px-4 py-2 rounded-full text-sm">تغيير الغلاف</span>
                </div>
              </div>
              
              <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-lg font-bold text-primary">عنوان الرواية</Label>
              <Input id="title" className="h-14 text-xl bg-secondary/10 border-primary/10 focus:ring-primary font-bold" placeholder="اسم ملحمتك..." required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-bold text-primary">النبذة</Label>
              <textarea id="description" className="w-full min-h-[180px] p-5 border rounded-xl bg-secondary/10 border-primary/10 focus:ring-2 focus:ring-primary outline-none resize-y text-lg" placeholder="اكتب مقدمة مشوقة..." required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-lg font-bold text-primary">التصنيف</Label>
                <select id="category" className="w-full h-14 p-3 border rounded-xl bg-secondary/10 border-primary/10 font-bold focus:ring-2 focus:ring-primary outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="فانتازيا">فانتازيا 🪄</option>
                  <option value="رومانسي">رومانسي ❤️</option>
                  <option value="خيال علمي">خيال علمي 🚀</option>
                  <option value="رعب">رعب 👻</option>
                  <option value="غموض">غموض 🔍</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-lg font-bold text-primary">الحالة</Label>
                <select id="status" className="w-full h-14 p-3 border rounded-xl bg-secondary/10 border-primary/10 font-bold focus:ring-2 focus:ring-primary outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ongoing">مستمرة ✍️</option>
                  <option value="completed">مكتملة ✅</option>
                </select>
              </div>
            </div>

          </CardContent>
          
          <CardFooter className="bg-secondary/5 border-t p-8 flex flex-col gap-6">
            <div className="w-full flex items-center gap-3 text-sm text-blue-700 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <Info className="w-6 h-6 flex-shrink-0" />
              <p className="font-medium">سيتم حفظ الرواية كـ <span className="font-bold underline">مسودة خاصة بك</span> ولن تظهر للجمهور.</p>
            </div>
            
            <Button type="submit" className="w-full text-xl h-16 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all font-black" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-6 h-6 animate-spin mr-2" /> جاري الحفظ...</> : "إنشاء المسودة والبدء بالكتابة 🚀"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}