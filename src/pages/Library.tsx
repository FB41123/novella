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
        const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/library", {
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

      <div className="flex flex-wrap gap-2 mb-8 bg-secondary/10 p-1.5 rounded-xl w-fit shadow-sm">
        <Button variant={activeTab === "favorites" ? "default" : "ghost"} onClick={() => setActiveTab("favorites")} className="gap-2 rounded-lg">
          <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "fill-current" : ""}`} /> الروايات المفضلة
        </Button>
        <Button variant={activeTab === "writers" ? "default" : "ghost"} onClick={() => setActiveTab("writers")} className="gap-2 rounded-lg">
          <UserCheck className="w-4 h-4" /> الكتّاب المتابعون
        </Button>
        <Button variant={activeTab === "friends" ? "default" : "ghost"} onClick={() => setActiveTab("friends")} className="gap-2 rounded-lg">
          <Users className="w-4 h-4" /> الأصدقاء
        </Button>
      </div>

      <div className="animate-in fade-in duration-500 min-h-[400px]">
        
        {/* المفضلة */}
        {activeTab === "favorites" && (
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
        )}

        {/* الكتاب */}
        {activeTab === "writers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {followedWriters.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-secondary/5 border-2 border-dashed rounded-xl">
                <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-lg">لم تتابع أي كاتب بعد</h3>
              </div>
             ) : (
               followedWriters.map((writer: any) => (
                 <Link key={writer.id} to={`/profile/${writer.id}`}>
                   <Card className="hover:shadow-md transition-shadow border-primary/10">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{writer.username.charAt(0)}</div>
                       <h3 className="font-bold text-lg">{writer.username}</h3>
                     </CardContent>
                   </Card>
                 </Link>
               ))
             )}
          </div>
        )}

        {/* الأصدقاء */}
        {activeTab === "friends" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {followedFriends.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-secondary/5 border-2 border-dashed rounded-xl">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-lg">قائمة الأصدقاء فارغة</h3>
              </div>
             ) : (
               followedFriends.map((friend: any) => (
                 <Link key={friend.id} to={`/profile/${friend.id}`}>
                   <Card className="hover:shadow-md transition-shadow border-primary/10">
                     <CardContent className="p-4 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center font-bold text-green-600">{friend.username.charAt(0)}</div>
                       <h3 className="font-bold text-lg">{friend.username}</h3>
                     </CardContent>
                   </Card>
                 </Link>
               ))
             )}
          </div>
        )}

      </div>
    </div>
  );
}