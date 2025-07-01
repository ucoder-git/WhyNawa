import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PetService } from "@shared/schema";

interface ServiceCardProps {
  service: PetService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'grooming':
        return '펫미용';
      case 'training':
        return '펫훈련';
      case 'veterinary':
        return '일반진료';
      case 'boarding':
        return '펫호텔';
      default:
        return type;
    }
  };

  return (
    <Card className="bg-white rounded-lg p-4 shadow-pet-card hover:shadow-pet-hover transition-shadow cursor-pointer">
      <div className="text-center">
        {service.images && service.images.length > 0 ? (
          <img
            src={service.images[0]}
            alt={service.name}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-4xl">🐕</span>
          </div>
        )}
        
        <h3 className="font-medium text-pet-neutral-900 mb-1">
          {service.name}
        </h3>
        
        <div className="flex items-center justify-center text-pet-neutral-500 text-sm mb-2">
          <span>{getServiceTypeText(service.type)}</span>
          <span className="mx-2">·</span>
          <MapPin className="w-3 h-3 mr-1" />
          <span>{service.location}</span>
        </div>
        
        {service.rating && (
          <div className="flex items-center justify-center text-yellow-400 text-sm mb-2">
            <Star className="w-3 h-3 mr-1 fill-current" />
            <span className="text-pet-neutral-900 mr-1">{service.rating}</span>
            <span className="text-pet-neutral-500">
              ({service.reviewCount || 0})
            </span>
          </div>
        )}
        
        <p className="text-pet-primary font-medium">
          {service.priceRange || '가격 문의'}
        </p>
      </div>
    </Card>
  );
}
