import { MessageSquareDashed, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Messages() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-in fade-in zoom-in duration-500 px-4">
      <div className="relative">
        <MessageSquareDashed className="w-32 h-32 text-primary/10" />
        <Wrench className="w-12 h-12 text-primary absolute bottom-0 right-0 animate-bounce shadow-lg rounded-full bg-background p-1" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-primary drop-shadow-sm">نظام المراسلة الخاص</h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
        نعمل حالياً على بناء نظام محادثات فوري ومتطور يتيح لك التواصل المباشر مع كُتّابك المفضلين وأصدقائك في المنصة. 🚀
      </p>
      
      <div className="pt-4 flex gap-4">
        <Button disabled variant="outline" className="font-bold rounded-xl h-12 px-6 border-primary/20 bg-primary/5">
          قريباً جداً ⏳
        </Button>
        <Button onClick={() => navigate("/")} className="font-bold rounded-xl h-12 px-6 shadow-md hover:shadow-lg transition-all">
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}