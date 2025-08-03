import { Heart, MessageCircle, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Listing, User, Category } from "@shared/schema";

interface ProductCardProps {
  listing: Listing & { seller?: User; category?: Category };
  onLike?: (listingId: number) => void;
}

export default function ProductCard({ listing, onLike }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR').format(parseFloat(price)) + '원';
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
    <Card className="bg-white rounded-lg shadow-pet-card hover:shadow-pet-hover transition-shadow cursor-pointer">
      {listing.images && listing.images.length > 0 ? (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-400">이미지 없음</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-medium text-pet-neutral-900 mb-1 line-clamp-2">
          {listing.title}
        </h3>
        
        <p className="text-pet-primary font-bold text-lg mb-2">
          {formatPrice(listing.price)}
        </p>
        
        <div className="flex items-center text-pet-neutral-500 text-sm mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{listing.location}</span>
          <span className="mx-2">·</span>
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTimeAgo(listing.createdAt!)}</span>
        </div>
        
        <div className="flex items-center justify-between text-pet-neutral-500 text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(listing.id);
              }}
              className="flex items-center hover:text-pet-primary transition-colors"
            >
              <Heart className="w-3 h-3 mr-1" />
              <span>{listing.likeCount || 0}</span>
            </button>
            
            <div className="flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              <span>0</span>
            </div>
          </div>
          
          {listing.condition && (
            <span className="bg-pet-neutral-100 text-pet-neutral-900 px-2 py-1 rounded text-xs">
              {listing.condition === 'new' ? '새상품' :
               listing.condition === 'like_new' ? '거의 새것' :
               listing.condition === 'good' ? '좋음' : '보통'}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
