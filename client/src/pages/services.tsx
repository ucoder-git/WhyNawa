import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceCard from "@/components/service-card";
import { Search, MapPin } from "lucide-react";

export default function ServicesPage() {
  const [location, setLocation] = useState("서초4동");
  const [serviceType, setServiceType] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: [
      `/api/pet-services`,
      location && `location=${encodeURIComponent(location)}`,
      serviceType && `type=${serviceType}`,
    ].filter(Boolean).join("&"),
  });

  const serviceTypes = [
    { value: "", label: "전체 서비스" },
    { value: "grooming", label: "펫미용" },
    { value: "training", label: "펫훈련" },
    { value: "veterinary", label: "일반진료" },
    { value: "boarding", label: "펫호텔" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Header */}
      <h1 className="text-2xl font-bold text-pet-neutral-900 mb-6">펫서비스</h1>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-pet-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="지역으로 검색"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="서비스 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {serviceTypes.slice(1).map((type) => (
          <button
            key={type.value}
            onClick={() => setServiceType(type.value)}
            className={`p-4 rounded-lg border text-center transition-colors ${
              serviceType === type.value
                ? "bg-pet-primary text-white border-pet-primary"
                : "bg-white text-pet-neutral-900 border-gray-200 hover:border-pet-primary"
            }`}
          >
            <div className="text-2xl mb-2">
              {type.value === "grooming" && "✂️"}
              {type.value === "training" && "🎓"}
              {type.value === "veterinary" && "🩺"}
              {type.value === "boarding" && "🏨"}
            </div>
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : services && services.length > 0 ? (
        <>
          <div className="text-sm text-pet-neutral-500 mb-4">
            총 {services.length}개의 서비스
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-pet-neutral-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-pet-neutral-500 mb-6">
            다른 지역이나 서비스 유형을 시도해보세요
          </p>
        </div>
      )}
    </main>
  );
}
