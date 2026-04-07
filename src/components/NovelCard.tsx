import React from "react";
import { Link } from "react-router-dom";
import { Novel } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";

export interface NovelCardProps {
  novel: Novel;
}

export const NovelCard: React.FC<NovelCardProps> = ({ novel }) => {
  return (
    <Link to={`/novel/${novel.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col group">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={novel.cover}
            alt={novel.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Badge variant={novel.status === "completed" ? "secondary" : "default"}>
              {novel.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 flex-1">
          <h3 className="font-bold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {novel.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{novel.authorName}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {novel.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-5">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {novel.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{novel.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{novel.likes.toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
