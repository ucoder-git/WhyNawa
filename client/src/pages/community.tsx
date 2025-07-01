import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CommunityPostCard from "@/components/community-post-card";
import { PlusCircle, Filter, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const communityPostSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요"),
  type: z.string().min(1, "글 유형을 선택해주세요"),
  location: z.string().optional(),
  authorId: z.number().default(1), // In real app, this would come from auth
});

type CommunityPostForm = z.infer<typeof communityPostSchema>;

export default function CommunityPage() {
  const [location, setLocation] = useState("서초4동");
  const [postType, setPostType] = useState("");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: [
      `/api/community-posts`,
      location && `location=${encodeURIComponent(location)}`,
      postType && `type=${postType}`,
    ].filter(Boolean).join("&"),
  });

  const form = useForm<CommunityPostForm>({
    resolver: zodResolver(communityPostSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "",
      location: location,
      authorId: 1,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: CommunityPostForm) => {
      return await apiRequest("POST", "/api/community-posts", data);
    },
    onSuccess: () => {
      toast({
        title: "글 작성 완료",
        description: "커뮤니티 글이 성공적으로 작성되었습니다.",
      });
      setIsPostDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
    onError: () => {
      toast({
        title: "글 작성 실패",
        description: "글 작성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const postTypes = [
    { value: "", label: "전체", color: "gray", emoji: "📝" },
    { value: "lost", label: "실종", color: "red", emoji: "🔍" },
    { value: "found", label: "발견", color: "green", emoji: "🎉" },
    { value: "adoption", label: "입양", color: "blue", emoji: "🏠" },
    { value: "gathering", label: "모임", color: "purple", emoji: "👥" },
    { value: "general", label: "일반", color: "gray", emoji: "💬" },
  ];

  const onSubmit = (data: CommunityPostForm) => {
    createPostMutation.mutate({ ...data, location });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pet-neutral-900">펫커뮤니티</h1>
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pet-primary text-white hover:bg-orange-600">
              <PlusCircle className="w-4 h-4 mr-2" />
              글쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 글 작성</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>글 유형</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="글 유형 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {postTypes.slice(1).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.emoji} {type.label}
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="글 제목을 입력하세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="내용을 자세히 작성해주세요"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-pet-primary text-white hover:bg-orange-600"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? "작성 중..." : "글 작성"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
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
          
          <Select value={postType} onValueChange={setPostType}>
            <SelectTrigger>
              <SelectValue placeholder="글 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {postTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.emoji} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Post Type Quick Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
        {postTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setPostType(type.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              postType === type.value
                ? "bg-pet-primary text-white"
                : "bg-white text-pet-neutral-900 border border-gray-200 hover:border-pet-primary"
            }`}
          >
            <span>{type.emoji}</span>
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <>
          <div className="text-sm text-pet-neutral-500 mb-4">
            총 {posts.length}개의 글
          </div>
          <div className="space-y-4">
            {posts.map((post: any) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium text-pet-neutral-900 mb-2">
            아직 글이 없습니다
          </h3>
          <p className="text-pet-neutral-500 mb-6">
            첫 번째 글을 작성해보세요!
          </p>
          <Button
            onClick={() => setIsPostDialogOpen(true)}
            className="bg-pet-primary text-white hover:bg-orange-600"
          >
            첫 글 작성하기
          </Button>
        </div>
      )}
    </main>
  );
}
