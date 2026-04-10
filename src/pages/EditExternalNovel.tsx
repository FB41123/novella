import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Save } from "lucide-react";

export function EditExternalNovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover: "",
    sourceUrl: ""
  });

  // جلب بيانات الرواية الحالية
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const response = await api.get(`/novels/${id}`);
        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
          cover: response.data.cover || response.data.coverImage || "",
          sourceUrl: response.data.sourceUrl || ""
        });
      } catch (error) {
        alert("حدث خطأ في جلب بيانات الرواية");
      } finally {
        setIsFetching(false);
      }
    };
    fetchNovel();
  }, [id]);

  // حفظ التعديلات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/novels/${id}`, formData);
      alert("✅ تم تحديث الرواية الخارجية بنجاح!");
      navigate("/admin"); // العودة للوحة التحكم
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="text-center py-20 font-bold">جاري التحميل... ⏳</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowRight className="w-4 h-4" /> العودة
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-700">تعديل رواية خارجية 🌐</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label>اسم الرواية</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>وصف الرواية</Label>
              <textarea 
                className="w-full border rounded-md p-3 min-h-[100px]"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>الرابط الخارجي (المصدر)</Label>
              <Input 
                type="url"
                dir="ltr"
                className="text-left"
                value={formData.sourceUrl} 
                onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})} 
                required 
              />
              <p className="text-xs text-muted-foreground">تأكد أن الرابط يبدأ بـ http أو https</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ التعديلات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}