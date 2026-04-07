import { useState } from "react";
import { Post } from "@/services/posts";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  
  return (
  
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.userAvatar} alt={post.username} />
          <AvatarFallback>{post.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{post.username}</h3>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="p-2 border-t flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", isLiked && "text-red-500 hover:text-red-600")}
          onClick={handleLike}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {post.comments}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          {t('feed.share')}
        </Button>
      </CardFooter>
    </Card>
  );
}

