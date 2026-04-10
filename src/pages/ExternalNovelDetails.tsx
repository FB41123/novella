import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNovelById } from "@/services/novels";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, BookOpen } from "lucide-react";

export function ExternalNovelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<any>(null);

  useEffect(() => {
    const fetchNovel = async () => {
      if (id) {
        const data = await getNovelById(id);
        setNovel(data);
      }
    };
    fetchNovel();
  }, [id]);

  if (!novel) return <div className="text-center py-32">جاري التحميل... ⏳</div>;

  return (
    <div className="min-h-screen bg-secondary/5 pb-12">
      <div className="container mx-auto px-4 pt-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowRight className="w-4 h-4" /> العودة
        </Button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary/10">
          <div className="flex flex-col md:flex-row">
            {/* الغلاف */}
            <div className="w-full md:w-1/3 bg-muted p-6 flex justify-center items-center">
               <img src={novel.coverImage || novel.cover} alt={novel.title} className="rounded-xl shadow-lg w-full max-w-[250px] object-cover aspect-[2/3]" />
            </div>
            
            {/* التفاصيل */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full w-fit mb-4">
                رواية خارجية 🌐
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-primary mb-4">{novel.title}</h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {novel.description}
              </p>
              
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8">
                <p className="text-indigo-800 font-medium mb-4">هذه الرواية متوفرة للقراءة في موقعها الأصلي. اضغط أدناه للانتقال للمصدر.</p>
                <a href={novel.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 gap-2 rounded-xl shadow-md">
                    <ExternalLink className="w-5 h-5" /> الانتقال للمصدر وقراءة الرواية
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}