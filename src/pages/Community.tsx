import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  UserCheck, 
  Search, 
  Users, 
  ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Community() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // التعديل السحري هنا: دمجنا جلب المستخدمين مع جلب قائمة اللي تتابعهم
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 1. جلب كل المستخدمين
        const usersRes = await fetch("${import.meta.env.VITE_API_URL}/api/users");
        let followingIds: string[] = [];

        // 2. إذا مسجل دخول، نجلب قائمة الناس اللي نتابعهم من المكتبة
        if (token) {
          const libraryRes = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/library", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (libraryRes.ok) {
            const libraryData = await libraryRes.json();
            // نطلع أرقام (IDs) الناس اللي نتابعهم ونحفظها في مصفوفة
            followingIds = libraryData.following?.map((f: any) => f.id) || [];
          }
        }

        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          // 3. نصفي القائمة ونعطي كل مستخدم حالته الصحيحة بناءً على المقارنة
          const finalUsers = allUsers
            .filter((u: any) => u.id !== currentUser?.id)
            .map((u: any) => ({
              ...u,
              isInteracted: followingIds.includes(u.id) // إذا كان الآيدي حقه موجود في قائمة متابعينك، بيصير true
            }));
            
          setUsers(finalUsers);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  // دالة المتابعة المحدثة
  const handleFollow = async (userItem: any) => {
    const isWriter = userItem.role === "writer";

    if (userItem.isInteracted) {
      const confirmUnfollow = window.confirm(`هل أنت متأكد من إلغاء ${isWriter ? 'المتابعة' : 'الصداقة'}؟`);
      if (!confirmUnfollow) return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/interactions/follow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ followingId: userItem.id }) 
      });

      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userItem.id 
          ? { ...u, isInteracted: data.isFollowing } 
          : u
        ));

        if (data.isFollowing) {
          alert(isWriter ? "تمت المتابعة بنجاح ✨" : "تمت إضافة الصديق بنجاح ✅");
        } else {
          alert(isWriter ? "تم إلغاء المتابعة" : "تمت الإزالة من الأصدقاء");
        }
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالسيرفر:", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center gap-2">
            <Users className="w-8 h-8" /> استكشاف المجتمع
          </h1>
          <p className="text-muted-foreground font-medium mt-1">تواصل مع الكتّاب المبدعين والقراء الذين يشاركونك اهتماماتك.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="ابحث عن اسم المستخدم..." 
            className="pr-10 h-12 rounded-2xl border-primary/10 shadow-sm focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-primary font-bold animate-pulse">جاري البحث في السجلات... 🔍</div>
      ) : (
        <div className="bg-card border border-primary/5 rounded-3xl overflow-hidden shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="p-20 text-center text-muted-foreground font-medium">لا يوجد مستخدمين بهذا الاسم حالياً.</div>
          ) : (
            <div className="divide-y divide-primary/5">
              {filteredUsers.map((userItem) => {
                const isWriter = userItem.role === "writer";
                return (
                  <div 
                    key={userItem.id} 
                    className="flex items-center justify-between p-4 md:p-6 hover:bg-secondary/5 transition-colors group"
                  >
                    <div 
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => navigate(`/profile/${userItem.id}`)}
                    >
                      <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden border-2 border-primary/10 flex-shrink-0 group-hover:border-primary/30 transition-all">
                        {userItem.avatar ? (
                          <img src={userItem.avatar} className="w-full h-full object-cover" alt={userItem.username} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-bold text-xl">
                            {userItem.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {userItem.username}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isWriter ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {isWriter ? 'كاتب' : 'قارئ'}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px] md:max-w-md italic">
                          {userItem.bio || "لا يوجد وصف حالياً.. ✨"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleFollow(userItem)}
                        variant={userItem.isInteracted ? "outline" : "default"}
                        className={`h-10 px-6 rounded-xl font-bold transition-all flex items-center gap-2 min-w-[140px] ${
                          userItem.isInteracted 
                            ? "border-primary/20 text-muted-foreground hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30" 
                            : "shadow-md hover:shadow-lg active:scale-95"
                        }`}
                      >
                        {userItem.isInteracted ? (
                          <>
                            <UserCheck className="w-4 h-4" />
                            {isWriter ? "متابع" : "صديق"}
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            {isWriter ? "متابعة" : "إضافة صديق"}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors" 
                        onClick={() => navigate(`/profile/${userItem.id}`)}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}