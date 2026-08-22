import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, UserCheck, BookOpen, Loader2 } from "lucide-react";

export function Library() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [libraryData, setLibraryData] = useState({ favorites: [], following: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://novella-api.onrender.com/api/interactions/library", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setLibraryData(data);
        }
      } catch (error) {
        console.error("خطأ في جلب المكتبة:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  if (isLoading) return <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  // فصل المتابعين إلى كتّاب وأصدقاء (قراء)
  const followedWriters = libraryData.following.filter((u: any) => u.role === 'writer');
  const followedFriends = libraryData.following.filter((u: any) => u.role === 'reader');

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-primary mb-8 border-b border-primary/10 pb-4 flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-blue-500" /> مكتبتي الخاصة
      </h1>

      <div className="animate-in fade-in duration-500 min-h-[400px]">
        {/* المفضلة فقط */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {libraryData.favorites.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-secondary/5 border-2 border-dashed rounded-xl">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-bold text-lg">مكتبتك فارغة</h3>
            </div>
          ) : (
            libraryData.favorites.map((novel: any) => (
              <Link key={novel.id} to={`/novel/${novel.id}`}>
                <Card className="border-none shadow-none bg-transparent group cursor-pointer h-full">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-sm mb-3">
                    <img src={novel.coverImage || novel.cover || "https://via.placeholder.com/300x450?text=No+Cover"} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-1 text-center group-hover:text-primary transition-colors">{novel.title}</h3>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}