import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Globe, ArrowRight, Camera, Loader2, Link as LinkIcon, UserCheck } from "lucide-react";

export function AdminImportNovel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalAuthor, setOriginalAuthor] = useState(""); // 👈 حقل جديد
  const [sourceUrl, setSourceUrl] = useState("");         // 👈 حقل جديد
  const [category, setCategory] = useState("فانتازيا");
  const [coverImage, setCoverImage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/novels", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          title,
          description,
          tags: category,
          coverImage,
          originalAuthor, // إرسال بيانات الكاتب الأصلي
          sourceUrl,      // إرسال رابط المصدر
          isPublished: true, // 🌍 نشر فوري للجمهور!
          authorId: user?.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert("🌍 تمت عملية الجلب والنشر بنجاح!");
        navigate(`/manage-novel/${data.id}`); 
      }
    } catch (error) {
      alert("❌ حدث خطأ أثناء الجلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate("/admin")}>
        <ArrowRight className="w-4 h-4" /> العودة لغرفة التحكم
      </Button>

      <Card className="border-primary/20 shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black">جلب محتوى خارجي</CardTitle>
              <CardDescription className="text-primary-foreground/80 font-bold">
                قم بنقل رواية جاهزة من الإنترنت إلى منصتك مع حفظ حقوق أصحابها.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleImport}>
          <CardContent className="p-8 space-y-8">
            {/* قسم المصدر والكاتب (هذا هو الجديد والمهم) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/10 p-6 rounded-2xl border border-primary/10">
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold"><UserCheck className="w-4 h-4 text-primary"/> اسم الكاتب الأصلي</Label>
                  <Input 
                    placeholder="مثال: الكاتب محمد علي..." 
                    className="bg-background"
                    value={originalAuthor}
                    onChange={(e) => setOriginalAuthor(e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-bold"><LinkIcon className="w-4 h-4 text-primary"/> رابط المصدر (رابط الموقع الأصلي)</Label>
                  <Input 
                    placeholder="https://example.com/novel-link" 
                    className="bg-background text-left"
                    dir="ltr"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* رفع الغلاف */}
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                 <Label className="font-bold self-start">غلاف الرواية</Label>
                 <div 
                   className="w-full aspect-[2/3] border-4 border-dashed border-primary/20 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-secondary/5 hover:border-primary/50 transition-all"
                   onClick={() => fileInputRef.current?.click()}
                 >
                   {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : <Camera className="w-12 h-12 text-primary/20" />}
                 </div>
                 <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              {/* البيانات الأساسية */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold">عنوان الرواية</Label>
                  <Input required className="h-12 text-lg" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">التصنيف</Label>
                  <select className="w-full h-12 p-3 border rounded-xl bg-background" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="فانتازيا">فانتازيا</option>
                    <option value="رعب">رعب</option>
                    <option value="غموض">غموض</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">نبذة الرواية (الصقها هنا)</Label>
              <textarea 
                className="w-full min-h-[150px] p-4 border rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="bg-secondary/5 p-8 flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground font-bold">
              ⚠️ بمجرد الضغط، سيتم نشر الرواية فوراً للجمهور في الصفحة الرئيسية.
            </p>
            <Button type="submit" className="w-full h-16 text-xl font-black rounded-2xl shadow-xl" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : "نشر الرواية فوراً للجمهور 🚀"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}