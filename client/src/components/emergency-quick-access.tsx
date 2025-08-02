import { Phone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EmergencyQuickAccess() {
  const { toast } = useToast();

  const handleEmergencyCall = async () => {
    try {
      await apiRequest("POST", "/api/emergency-call", {
        timestamp: new Date().toISOString(),
        source: "quick_access_button"
      });

      toast({
        title: "응급전화 연결",
        description: "1588-0119로 연결됩니다.",
        variant: "default"
      });

      // In a real app, this would initiate the phone call
      if (typeof window !== 'undefined' && 'location' in window) {
        window.location.href = "tel:1588-0119";
      }
    } catch (error) {
      toast({
        title: "연결 실패",
        description: "응급전화 연결에 실패했습니다. 직접 1588-0119로 전화해주세요.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="relative">
        {/* Pulse animation background */}
        <div className="absolute inset-0 bg-pet-emergency rounded-full animate-ping opacity-75"></div>
        
        <button
          onClick={handleEmergencyCall}
          className="relative bg-pet-emergency text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white"
          aria-label="응급전화 1588-0119"
        >
          <div className="flex flex-col items-center">
            <Phone className="w-7 h-7 mb-1" />
            <span className="text-xs font-bold">응급</span>
          </div>
        </button>
        
        {/* Emergency label */}
        <div className="absolute -top-2 -left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          🚨 24H
        </div>
      </div>
    </div>
  );
}
