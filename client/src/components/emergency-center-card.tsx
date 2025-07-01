import { Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EmergencyHospital } from "@shared/schema";

interface EmergencyCenterCardProps {
  hospital: EmergencyHospital;
  onCall?: (hospitalId: number) => void;
}

export default function EmergencyCenterCard({ hospital, onCall }: EmergencyCenterCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '진료중';
      case 'busy':
        return '대기중';
      case 'closed':
        return '진료마감';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Card className="bg-white rounded-lg p-4 shadow-pet-card hover:shadow-pet-hover transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="text-2xl">🏥</div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-pet-neutral-900 mb-1">
            {hospital.name}
          </h3>
          
          <div className="flex items-center text-pet-neutral-500 text-sm mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{hospital.distance ? `${hospital.distance}km` : hospital.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            {hospital.is24Hours && (
              <span className="bg-pet-emergency text-white px-2 py-1 rounded text-xs font-medium">
                24시간
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(hospital.status || 'available')}`}>
              {getStatusText(hospital.status || 'available')}
            </span>
          </div>
          
          <Button
            onClick={() => onCall?.(hospital.id)}
            className="w-full bg-pet-emergency text-white hover:bg-red-600 transition-colors"
            size="sm"
          >
            <Phone className="w-3 h-3 mr-1" />
            응급전화
          </Button>
        </div>
      </div>
    </Card>
  );
}
