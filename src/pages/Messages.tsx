import { MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Messages() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl flex flex-col items-center justify-center text-center animate-in fade-in duration-700 min-h-[60vh]">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative border border-primary/20">
          <MessageCircle className="w-12 h-12 text-primary" />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-background rounded-full flex items-center justify-center border shadow-sm">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl font-black mb-4 text-foreground tracking-tight">المراسلة <span className="text-primary">قريباً</span></h1>
      <p className="text-muted-foreground text-lg mb-10 max-w-md leading-relaxed">
        نعمل بجهد لتوفير نظام مراسلة فوري وحيوي للتواصل مع أصدقائك وكتابك المفضلين. كُن بالجوار! ✨
      </p>
      
      <Link to="/">
        <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all px-8 font-bold">
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}