import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save, Link as LinkIcon, User } from "lucide-react";

export function EditExternalNovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // أضفنا حقل originalAuthor للكاتب الأصلي
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
          originalAuthor: response.data.originalAuthor || "" // جلب اسم الكاتب
        });
      } catch (error) {
        alert("حدث خطأ في جلب بيانات الرواية");
      } finally {
        setIsFetching(false);
      }
    };
    fetchNovel();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/novels/${id}`, formData);
      alert("✅ تم حفظ التعديلات بنجاح!");
      navigate("/admin"); // العودة للوحة التحكم أو الصفحة السابقة
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">اسم الرواية <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                  className="bg-secondary/20"
                />
              </div>

              {/* حقل اسم الكاتب الأصلي */}
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-1">
                  <User className="w-4 h-4 text-muted-foreground" /> الكاتب الأصلي
                </Label>
                <Input 
                  placeholder="مثال: J.K. Rowling"
                  value={formData.originalAuthor} 
                  onChange={(e) => setFormData({...formData, originalAuthor: e.target.value})} 
                  className="bg-secondary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">الرابط الخارجي (المصدر) <span className="text-red-500">*</span></Label>
              <Input 
                type="url"
                dir="ltr"
                placeholder="https://..."
                className="text-left bg-indigo-50/30 border-indigo-200 focus-visible:ring-indigo-500"
                value={formData.sourceUrl} 
                onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold">وصف الرواية</Label>
              <textarea 
                className="w-full border rounded-md p-3 min-h-[120px] bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                required 
              />
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