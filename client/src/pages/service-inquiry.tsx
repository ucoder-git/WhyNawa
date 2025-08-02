import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Phone, Mail, MapPin, FileText, Send } from "lucide-react";

const serviceInquirySchema = z.object({
  businessName: z.string().min(1, "업체명을 입력해주세요"),
  businessType: z.string().min(1, "업종을 선택해주세요"),
  ownerName: z.string().min(1, "대표자명을 입력해주세요"),
  phoneNumber: z.string().min(1, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요").optional().or(z.literal("")),
  address: z.string().min(1, "주소를 입력해주세요"),
  description: z.string().optional(),
  services: z.array(z.string()).optional(),
  businessLicense: z.string().optional(),
});

type ServiceInquiryForm = z.infer<typeof serviceInquirySchema>;

const businessTypes = [
  { value: "hospital", label: "동물병원" },
  { value: "cafe", label: "펫카페" },
  { value: "grooming", label: "펫미용실" },
  { value: "hotel", label: "펫호텔" },
  { value: "training", label: "펫훈련소" },
  { value: "boarding", label: "펫펜션" },
];

const serviceOptions = {
  hospital: ["진료", "수술", "건강검진", "예방접종", "응급치료"],
  cafe: ["실내놀이", "사회화훈련", "펫케어", "펫용품판매"],
  grooming: ["기본미용", "풀그루밍", "부분미용", "스타일링", "네일케어"],
  hotel: ["단기보호", "장기보호", "산책서비스", "케어서비스"],
  training: ["기본훈련", "문제행동교정", "사회화훈련", "어질리티"],
  boarding: ["숙박", "데이케어", "산책", "놀이시간"],
};

export default function ServiceInquiry() {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ServiceInquiryForm>({
    resolver: zodResolver(serviceInquirySchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      ownerName: "",
      phoneNumber: "",
      email: "",
      address: "",
      description: "",
      services: [],
      businessLicense: "",
    },
  });

  const createInquiryMutation = useMutation({
    mutationFn: async (data: ServiceInquiryForm) => {
      return await apiRequest("POST", "/api/service-inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "문의 접수 완료",
        description: "서비스 등록 문의가 성공적으로 접수되었습니다. 검토 후 연락드리겠습니다.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/service-inquiries"] });
    },
    onError: (error) => {
      toast({
        title: "문의 접수 실패",
        description: "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceInquiryForm) => {
    createInquiryMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pet-neutral-900 mb-2">펫서비스 등록 문의</h1>
        <p className="text-pet-neutral-600">
          동물병원, 펫카페, 펫미용실, 펫호텔 등의 펫서비스를 등록하시려면 아래 양식을 작성해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 안내 사항 */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">등록 가능 서비스</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {businessTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Badge variant="outline">{type.label}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">처리 절차</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-pet-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p>문의 접수 및 확인</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-pet-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p>서류 검토 및 현장 확인</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-pet-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p>승인 및 서비스 등록</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 문의 양식 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>서비스 등록 신청서</span>
              </CardTitle>
              <CardDescription>
                정확한 정보를 입력해주시면 빠른 처리가 가능합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>업체명 *</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="펫프렌즈 동물병원" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>업종 *</FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedBusinessType(value);
                              }} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="업종을 선택하세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>대표자명 *</FormLabel>
                            <FormControl>
                              <Input placeholder="홍길동" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>연락처 *</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="010-1234-5678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>이메일</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>주소 *</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 서비스 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">서비스 정보</h3>
                    
                    {selectedBusinessType && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">제공 서비스</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {serviceOptions[selectedBusinessType as keyof typeof serviceOptions]?.map((service) => (
                            <Badge key={service} variant="outline" className="justify-center py-2">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상세 설명</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="업체 소개, 특화 서비스, 운영 시간 등을 자유롭게 작성해주세요"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사업자등록번호</FormLabel>
                          <FormControl>
                            <Input placeholder="123-45-67890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createInquiryMutation.isPending}
                  >
                    {createInquiryMutation.isPending ? (
                      "접수 중..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        문의 접수하기
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}