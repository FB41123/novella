import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import imageCompression from 'browser-image-compression';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save, Link as LinkIcon, User, Camera } from "lucide-react";

export function EditExternalNovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: "",
    sourceUrl: "",
    originalAuthor: "" 
  });

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const response = await api.get(`/novels/${id}`);
        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
          cover: response.data.cover || response.data.coverImage || "",
          sourceUrl: response.data.sourceUrl || "",
          originalAuthor: response.data.originalAuthor || ""
        });
      } catch (error) {
        alert("حدث خطأ في جلب بيانات الرواية");
      } finally {
        setIsFetching(false);
      }
    };
    fetchNovel();
  }, [id]);

  // 🚀 دالة رفع وضغط الصورة
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, cover: reader.result as string });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      alert("فشل ضغط الصورة، حاول مجدداً.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // إرسال coverImage مع البيانات ليحفظها السيرفر
      await api.put(`/novels/${id}`, { ...formData, coverImage: formData.cover });
      alert("✅ تم حفظ التعديلات بنجاح!");
      navigate(-1); // العودة للوحة التحكم
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="text-center py-20 font-bold">جاري جلب البيانات... ⏳</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-in fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2 hover:bg-secondary">
        <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
      </Button>

      <Card className="border-indigo-100 shadow-lg">
        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-6">
          <CardTitle className="text-2xl text-indigo-800 flex items-center gap-2">
            <LinkIcon className="w-6 h-6 text-indigo-500" />
            تعديل بيانات الرواية الخارجية
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 🖼️ قسم تعديل الغلاف */}
            <div className="flex flex-col items-center justify-center space-y-4 py-4 border-b border-indigo-100/50">
              <Label className="font-bold text-indigo-900 self-start">غلاف الرواية</Label>
              <div 
                className="w-48 h-64 border-4 border-dashed border-indigo-200 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-indigo-50/30 relative group transition-all hover:border-indigo-400 hover:shadow-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.cover ? (
                  <img src={formData.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center gap-3">
                    <Camera className="w-12 h-12 text-indigo-300" />
                    <span className="text-sm font-bold text-indigo-400 leading-tight">اضغط لتغيير الغلاف</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold bg-indigo-600 px-4 py-2 rounded-full text-sm">تغيير الصورة</span>
                </div>
              </div>
              <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">اسم الرواية</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="bg-secondary/20" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  <User className="w-4 h-4 text-muted-foreground" /> الكاتب الأصلي
                </Label>
                <Input value={formData.originalAuthor} onChange={(e) => setFormData({...formData, originalAuthor: e.target.value})} className="bg-secondary/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">الرابط الخارجي (المصدر)</Label>
              <Input type="url" dir="ltr" className="text-left bg-indigo-50/30 border-indigo-200" value={formData.sourceUrl} onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <Label className="font-bold">وصف الرواية</Label>
              <textarea className="w-full border rounded-md p-3 min-h-[120px] bg-secondary/20" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 h-14 text-lg font-bold shadow-md rounded-xl">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ التعديلات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}