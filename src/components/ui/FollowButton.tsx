import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FollowButton({ targetUserId, initialIsFollowing = false }: { targetUserId: string, initialIsFollowing?: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // نجلب التوكن عشان الباك إند يعرف مين اللي ضغط الزر
      
      const res = await fetch("https://novella-api.onrender.com/api/interactions/follow", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // لاحظ هنا: أرسلنا followingId لأن الباك إند حقك يطلب هذا الاسم
        body: JSON.stringify({ followingId: targetUserId }) 
      });

      if (res.ok) {
        const data = await res.json();
        // الباك إند حقك يرجع isFollowing: true أو false، نستخدمها عشان نغير شكل الزر
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("خطأ في المتابعة:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFollowClick} 
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      className="gap-2"
    >
      {isLoading ? "جاري..." : isFollowing ? "إلغاء المتابعة" : "إضافة صديق / متابعة"}
    </Button>
  );
}