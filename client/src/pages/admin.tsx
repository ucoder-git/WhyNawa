import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import type { ServiceInquiry, EmergencyHospital, PetService } from "@shared/schema";

export default function Admin() {
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    location: "",
    is24Hours: false,
    services: [] as string[],
  });
  const [serviceForm, setServiceForm] = useState({
    name: "",
    type: "",
    address: "",
    phoneNumber: "",
    location: "",
    description: "",
    services: [] as string[],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 서비스 문의 조회
  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<ServiceInquiry[]>({
    queryKey: ["/api/service-inquiries"],
  });

  // 응급병원 조회
  const { data: hospitals = [], isLoading: hospitalsLoading } = useQuery<EmergencyHospital[]>({
    queryKey: ["/api/emergency-hospitals"],
  });

  // 펫서비스 조회
  const { data: services = [], isLoading: servicesLoading } = useQuery<PetService[]>({
    queryKey: ["/api/pet-services"],
  });

  // 문의 상태 업데이트
  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      return await apiRequest("PUT", `/api/service-inquiries/${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      toast({
        title: "문의 처리 완료",
        description: "문의 상태가 업데이트되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-inquiries"] });
      setSelectedInquiry(null);
      setIsApproveDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "처리 실패",
        description: "문의 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 응급병원 생성
  const createHospitalMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/emergency-hospitals", data);
    },
    onSuccess: () => {
      toast({
        title: "병원 등록 완료",
        description: "응급병원이 성공적으로 등록되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-hospitals"] });
      setHospitalForm({
        name: "",
        address: "",
        phoneNumber: "",
        location: "",
        is24Hours: false,
        services: [],
      });
    },
  });

  // 펫서비스 생성
  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/pet-services", data);
    },
    onSuccess: () => {
      toast({
        title: "서비스 등록 완료",
        description: "펫서비스가 성공적으로 등록되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pet-services"] });
      setServiceForm({
        name: "",
        type: "",
        address: "",
        phoneNumber: "",
        location: "",
        description: "",
        services: [],
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">대기중</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-600 border-green-600">승인됨</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-600 border-red-600">거절됨</Badge>;
      case "under_review":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">검토중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const approveInquiry = () => {
    if (!selectedInquiry) return;

    // 문의를 승인하고 해당하는 서비스로 등록
    const isHospital = selectedInquiry.businessType === "hospital";
    
    if (isHospital) {
      // 응급병원으로 등록
      createHospitalMutation.mutate({
        name: selectedInquiry.businessName,
        address: selectedInquiry.address,
        phoneNumber: selectedInquiry.phoneNumber,
        location: selectedInquiry.address.split(" ")[0] + " " + selectedInquiry.address.split(" ")[1],
        is24Hours: false,
        services: selectedInquiry.services || [],
        status: "available",
      });
    } else {
      // 펫서비스로 등록
      createServiceMutation.mutate({
        name: selectedInquiry.businessName,
        type: selectedInquiry.businessType,
        address: selectedInquiry.address,
        phoneNumber: selectedInquiry.phoneNumber,
        location: selectedInquiry.address.split(" ")[0] + " " + selectedInquiry.address.split(" ")[1],
        description: selectedInquiry.description,
        services: selectedInquiry.services || [],
      });
    }

    // 문의 상태를 승인으로 변경
    updateInquiryMutation.mutate({
      id: selectedInquiry.id,
      status: "approved",
      adminNotes: "서비스가 성공적으로 등록되었습니다.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pet-neutral-900 mb-2">관리자 대시보드</h1>
        <p className="text-pet-neutral-600">펫서비스 등록 문의 및 서비스 관리</p>
      </div>

      <Tabs defaultValue="inquiries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inquiries">서비스 문의</TabsTrigger>
          <TabsTrigger value="hospitals">응급병원 관리</TabsTrigger>
          <TabsTrigger value="services">펫서비스 관리</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
        </TabsList>

        {/* 서비스 문의 관리 */}
        <TabsContent value="inquiries" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">서비스 등록 문의</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {inquiries.filter((i: ServiceInquiry) => i.status === "pending").length}건 대기중
            </Badge>
          </div>

          {inquiriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inquiries.map((inquiry: ServiceInquiry) => (
                <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{inquiry.businessName}</CardTitle>
                      {getStatusBadge(inquiry.status || "pending")}
                    </div>
                    <CardDescription className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{inquiry.businessType === "hospital" ? "동물병원" : 
                             inquiry.businessType === "cafe" ? "펫카페" :
                             inquiry.businessType === "grooming" ? "펫미용실" :
                             inquiry.businessType === "hotel" ? "펫호텔" : inquiry.businessType}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-pet-neutral-500" />
                        <span>{inquiry.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-pet-neutral-500" />
                        <span className="truncate">{inquiry.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-pet-neutral-500" />
                        <span>{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : "날짜 없음"}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedInquiry?.businessName}</DialogTitle>
                            <DialogDescription>서비스 등록 문의 상세 정보</DialogDescription>
                          </DialogHeader>
                          {selectedInquiry && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="font-semibold">업체명</label>
                                  <p>{selectedInquiry.businessName}</p>
                                </div>
                                <div>
                                  <label className="font-semibold">업종</label>
                                  <p>{selectedInquiry.businessType}</p>
                                </div>
                                <div>
                                  <label className="font-semibold">대표자명</label>
                                  <p>{selectedInquiry.ownerName}</p>
                                </div>
                                <div>
                                  <label className="font-semibold">연락처</label>
                                  <p>{selectedInquiry.phoneNumber}</p>
                                </div>
                              </div>
                              <div>
                                <label className="font-semibold">주소</label>
                                <p>{selectedInquiry.address}</p>
                              </div>
                              {selectedInquiry.description && (
                                <div>
                                  <label className="font-semibold">상세 설명</label>
                                  <p className="whitespace-pre-wrap">{selectedInquiry.description}</p>
                                </div>
                              )}
                              {selectedInquiry.status === "pending" && (
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    onClick={approveInquiry}
                                    className="flex-1"
                                    disabled={updateInquiryMutation.isPending}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    승인 및 등록
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => updateInquiryMutation.mutate({
                                      id: selectedInquiry.id,
                                      status: "rejected",
                                      adminNotes: "요건 미충족"
                                    })}
                                    className="flex-1"
                                    disabled={updateInquiryMutation.isPending}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    거절
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 응급병원 관리 */}
        <TabsContent value="hospitals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">응급병원 관리</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {hospitals.length}개 등록됨
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>새 응급병원 등록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="병원명"
                  value={hospitalForm.name}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                />
                <Input
                  placeholder="연락처"
                  value={hospitalForm.phoneNumber}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, phoneNumber: e.target.value })}
                />
                <Input
                  placeholder="주소"
                  className="md:col-span-2"
                  value={hospitalForm.address}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                />
                <Input
                  placeholder="지역"
                  value={hospitalForm.location}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is24Hours"
                    checked={hospitalForm.is24Hours}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, is24Hours: e.target.checked })}
                  />
                  <label htmlFor="is24Hours">24시간 운영</label>
                </div>
              </div>
              <Button 
                onClick={() => createHospitalMutation.mutate(hospitalForm)}
                className="mt-4"
                disabled={createHospitalMutation.isPending || !hospitalForm.name || !hospitalForm.address}
              >
                <Plus className="w-4 h-4 mr-2" />
                응급병원 등록
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map((hospital: EmergencyHospital) => (
              <Card key={hospital.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{hospital.name}</CardTitle>
                  <CardDescription>{hospital.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{hospital.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hospital.address}</span>
                    </div>
                    {hospital.is24Hours && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        24시간 운영
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 펫서비스 관리 */}
        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">펫서비스 관리</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {services.length}개 등록됨
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>새 펫서비스 등록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="서비스명"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
                <Select 
                  value={serviceForm.type}
                  onValueChange={(value) => setServiceForm({ ...serviceForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="서비스 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grooming">미용</SelectItem>
                    <SelectItem value="cafe">펫카페</SelectItem>
                    <SelectItem value="hotel">펫호텔</SelectItem>
                    <SelectItem value="training">훈련</SelectItem>
                    <SelectItem value="boarding">펜션</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="연락처"
                  value={serviceForm.phoneNumber}
                  onChange={(e) => setServiceForm({ ...serviceForm, phoneNumber: e.target.value })}
                />
                <Input
                  placeholder="지역"
                  value={serviceForm.location}
                  onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                />
                <Input
                  placeholder="주소"
                  className="md:col-span-2"
                  value={serviceForm.address}
                  onChange={(e) => setServiceForm({ ...serviceForm, address: e.target.value })}
                />
                <Textarea
                  placeholder="서비스 설명"
                  className="md:col-span-2"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>
              <Button 
                onClick={() => createServiceMutation.mutate(serviceForm)}
                className="mt-4"
                disabled={createServiceMutation.isPending || !serviceForm.name || !serviceForm.type}
              >
                <Plus className="w-4 h-4 mr-2" />
                펫서비스 등록
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service: PetService) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.type} • {service.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {service.phoneNumber && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{service.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{service.address}</span>
                    </div>
                    {service.description && (
                      <p className="text-pet-neutral-600 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 통계 */}
        <TabsContent value="stats" className="space-y-6">
          <h2 className="text-2xl font-bold">서비스 통계</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">총 문의</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inquiries.length}</div>
                <p className="text-xs text-muted-foreground">전체 서비스 등록 문의</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">대기중 문의</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter((i: ServiceInquiry) => i.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">처리 대기중인 문의</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">등록된 병원</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{hospitals.length}</div>
                <p className="text-xs text-muted-foreground">활성 응급병원</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">등록된 서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{services.length}</div>
                <p className="text-xs text-muted-foreground">활성 펫서비스</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}