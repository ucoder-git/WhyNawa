import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EmergencyCenterCard from "@/components/emergency-center-card";
import { Phone, MapPin, Clock, Ambulance } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const emergencyBookingSchema = z.object({
  petOwnerName: z.string().min(1, "반려인 이름을 입력해주세요"),
  petOwnerPhone: z.string().min(1, "연락처를 입력해주세요"),
  petName: z.string().min(1, "반려동물 이름을 입력해주세요"),
  petType: z.string().min(1, "반려동물 종류를 선택해주세요"),
  emergencyType: z.string().min(1, "응급 상황을 선택해주세요"),
  description: z.string().optional(),
  pickupLocation: z.string().min(1, "픽업 장소를 입력해주세요"),
  urgencyLevel: z.string().default("medium"),
});

type EmergencyBookingForm = z.infer<typeof emergencyBookingSchema>;

export default function EmergencyPage() {
  const [location, setLocation] = useState("서초4동");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hospitals, isLoading } = useQuery({
    queryKey: [`/api/emergency-hospitals?location=${encodeURIComponent(location)}`],
  });

  const form = useForm<EmergencyBookingForm>({
    resolver: zodResolver(emergencyBookingSchema),
    defaultValues: {
      petOwnerName: "",
      petOwnerPhone: "",
      petName: "",
      petType: "",
      emergencyType: "",
      description: "",
      pickupLocation: "",
      urgencyLevel: "medium",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: EmergencyBookingForm) => {
      return await apiRequest("POST", "/api/emergency-bookings", data);
    },
    onSuccess: () => {
      toast({
        title: "예약 완료",
        description: "응급 이송 예약이 완료되었습니다. 빠른 시간 내에 연락드리겠습니다.",
      });
      setIsBookingOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-bookings"] });
    },
    onError: (error) => {
      toast({
        title: "예약 실패",
        description: "예약 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyCall = () => {
    toast({
      title: "응급전화 연결",
      description: "1588-0119로 연결됩니다.",
    });
    if (typeof window !== 'undefined') {
      window.location.href = "tel:1588-0119";
    }
  };

  const onSubmit = (data: EmergencyBookingForm) => {
    createBookingMutation.mutate(data);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">24시간 펫응급센터</h1>
            <p className="text-red-100">반려동물 응급상황 시 즉시 연락하세요</p>
          </div>
          <Ambulance className="w-16 h-16 text-red-200" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Button
            onClick={handleEmergencyCall}
            className="bg-white text-red-600 hover:bg-red-50 font-bold py-3"
          >
            <Phone className="w-5 h-5 mr-2" />
            응급전화 1588-0119
          </Button>
          
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 font-bold py-3"
              >
                <Ambulance className="w-5 h-5 mr-2" />
                응급 이송 예약
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>응급 이송 예약</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="petOwnerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반려인 이름</FormLabel>
                        <FormControl>
                          <Input placeholder="홍길동" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petOwnerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처</FormLabel>
                        <FormControl>
                          <Input placeholder="010-1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반려동물 이름</FormLabel>
                        <FormControl>
                          <Input placeholder="멍멍이" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반려동물 종류</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="종류 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dog">강아지</SelectItem>
                            <SelectItem value="cat">고양이</SelectItem>
                            <SelectItem value="rabbit">토끼</SelectItem>
                            <SelectItem value="bird">새</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>응급 상황</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="응급 상황 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="injury">외상/부상</SelectItem>
                            <SelectItem value="poisoning">중독</SelectItem>
                            <SelectItem value="breathing">호흡곤란</SelectItem>
                            <SelectItem value="seizure">경련/발작</SelectItem>
                            <SelectItem value="unconscious">의식잃음</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>픽업 장소</FormLabel>
                        <FormControl>
                          <Input placeholder="서울시 서초구 ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상세 설명 (선택)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="증상이나 상황을 자세히 설명해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full bg-pet-emergency text-white hover:bg-red-600"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? "예약 중..." : "응급 이송 예약"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Guide */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-pet-emergency" />
            응급상황 대처법
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">즉시 응급실로 가야 하는 경우:</h4>
              <ul className="text-sm text-pet-neutral-500 space-y-1">
                <li>• 의식을 잃은 경우</li>
                <li>• 심한 출혈이 있는 경우</li>
                <li>• 호흡곤란이 있는 경우</li>
                <li>• 중독이 의심되는 경우</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">응급처치 요령:</h4>
              <ul className="text-sm text-pet-neutral-500 space-y-1">
                <li>• 차분함을 유지하세요</li>
                <li>• 반려동물을 안전한 곳으로 이동</li>
                <li>• 즉시 병원에 연락</li>
                <li>• 가능하면 상황을 사진으로 기록</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Hospitals */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pet-neutral-900">근처 응급병원</h2>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-pet-neutral-500" />
          <Input
            placeholder="지역 검색"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-32"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      ) : hospitals && hospitals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital: any) => (
            <EmergencyCenterCard
              key={hospital.id}
              hospital={hospital}
              onCall={(hospitalId) => {
                const selectedHospital = hospitals.find((h: any) => h.id === hospitalId);
                if (selectedHospital) {
                  toast({
                    title: "병원 연결",
                    description: `${selectedHospital.name}으로 연결됩니다.`,
                  });
                  if (typeof window !== 'undefined') {
                    window.location.href = `tel:${selectedHospital.phoneNumber}`;
                  }
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-lg font-medium text-pet-neutral-900 mb-2">
            근처에 등록된 응급병원이 없습니다
          </h3>
          <p className="text-pet-neutral-500 mb-6">
            다른 지역을 검색하거나 응급전화를 이용해주세요
          </p>
          <Button
            onClick={handleEmergencyCall}
            className="bg-pet-emergency text-white hover:bg-red-600"
          >
            응급전화 1588-0119
          </Button>
        </div>
      )}
    </main>
  );
}
