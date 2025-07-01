import { Heart, MessageCircle, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CommunityPost, User as UserType } from "@shared/schema";

interface CommunityPostCardProps {
  post: CommunityPost & { author: UserType };
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  const getPostTypeText = (type: string) => {
    switch (type) {
      case 'lost':
        return '실종';
      case 'found':
        return '발견';
      case 'adoption':
        return '입양';
      case 'gathering':
        return '모임';
      default:
        return '일반';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'adoption':
        return 'bg-blue-100 text-blue-800';
      case 'gathering':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const dateObj = new Date(date);
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  return (
    <Card className="bg-white rounded-lg p-4 shadow-pet-card hover:shadow-pet-hover transition-shadow cursor-pointer">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-pet-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-pet-neutral-900">
              {post.author?.username || "익명"}
            </span>
            <span className="text-pet-neutral-500 text-sm">
              {formatTimeAgo(post.createdAt!)}
            </span>
          </div>
          
          <h3 className="font-medium text-pet-neutral-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-pet-neutral-500 text-sm mb-3 line-clamp-2">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between text-pet-neutral-500 text-xs">
            <div className="flex items-center space-x-3">
              <button className="flex items-center hover:text-pet-primary transition-colors">
                <Heart className="w-3 h-3 mr-1" />
                <span>{post.likeCount || 0}</span>
              </button>
              
              <div className="flex items-center">
                <MessageCircle className="w-3 h-3 mr-1" />
                <span>{post.commentCount || 0}</span>
              </div>
            </div>
            
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPostTypeColor(post.type)}`}>
              {getPostTypeText(post.type)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
