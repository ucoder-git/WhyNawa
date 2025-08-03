import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, Upload, MapPin, Trophy } from "lucide-react";
import type { Category } from "@shared/schema";

const createListingSchema = z.object({
  title: z.string().min(1, "상품명을 입력해주세요").max(100, "상품명은 100자 이내로 입력해주세요"),
  description: z.string().min(10, "상품 설명을 10자 이상 입력해주세요").max(1000, "상품 설명은 1000자 이내로 입력해주세요"),
  price: z.string().min(1, "가격을 입력해주세요").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "올바른 가격을 입력해주세요"),
  categoryId: z.string().min(1, "카테고리를 선택해주세요"),
  condition: z.string().min(1, "상품 상태를 선택해주세요"),
  location: z.string().min(1, "거래 지역을 입력해주세요"),
  sellerId: z.number().default(1), // In real app, this would come from auth
});

type CreateListingForm = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
  condition: string;
  location: string;
  sellerId: number;
};

export default function PostItemPage() {
  const [, setLocation] = useLocation();
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<CreateListingForm>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
      condition: "",
      location: "서초4동",
      sellerId: 1,
    },
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      const listingData = {
        ...data,
        images: images,
      };
      return await apiRequest("POST", "/api/listings", listingData);
    },
    onSuccess: () => {
      toast({
        title: "상품 등록 완료",
        description: "상품이 성공적으로 등록되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      setLocation("/marketplace");
    },
    onError: (error) => {
      toast({
        title: "상품 등록 실패",
        description: "상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        setUploadingImage(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const conditionOptions = [
    { value: "new", label: "새상품", description: "사용하지 않은 새 제품" },
    { value: "like_new", label: "거의 새것", description: "사용감이 거의 없는 제품" },
    { value: "good", label: "좋음", description: "사용감은 있지만 상태가 좋은 제품" },
    { value: "fair", label: "보통", description: "사용감이 있고 약간의 흠집이 있는 제품" },
  ];

  const onSubmit = (data: CreateListingForm) => {
    if (images.length === 0) {
      toast({
        title: "이미지 필요",
        description: "최소 1장의 상품 이미지를 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }
    createListingMutation.mutate(data);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pet-neutral-900 mb-2">펫용품 판매하기</h1>
        <p className="text-pet-neutral-500">우리동네에서 펫용품을 안전하게 거래해보세요</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2 text-pet-primary" />
                상품 사진
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`상품 이미지 ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {images.length < 8 && (
                  <label className="w-full h-24 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pet-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <div className="animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">사진 추가</span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="text-sm text-pet-neutral-500 mt-2">
                최대 8장까지 업로드 가능합니다. 첫 번째 사진이 대표 이미지로 설정됩니다.
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품명</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 로얄캐닌 강아지 사료 15kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="">로딩중...</SelectItem>
                        ) : categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품 상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="상품 상태를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>판매 가격</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          className="pr-10"
                        />
                        <Trophy className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="상품에 대해 자세히 설명해주세요.&#10;&#10;• 브랜드, 모델명&#10;• 구매 시기 및 사용 기간&#10;• 상품 상태 및 특이사항&#10;• 교환/환불 정책"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-pet-primary" />
                거래 지역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="예: 서초4동" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-pet-neutral-500">
                      직거래를 원하는 지역을 입력해주세요
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/marketplace")}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createListingMutation.isPending || uploadingImage}
              className="flex-1 bg-pet-primary text-white hover:bg-orange-600"
            >
              {createListingMutation.isPending ? "등록 중..." : "상품 등록"}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
