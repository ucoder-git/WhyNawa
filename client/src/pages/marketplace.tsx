import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import { Search, Filter, Plus } from "lucide-react";
import type { Listing, Category } from "@shared/schema";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: [
      "/api/listings",
      searchTerm ? `search=${encodeURIComponent(searchTerm)}` : undefined,
      selectedCategory ? `categoryId=${selectedCategory}` : undefined,
      `sortBy=${sortBy}`
    ].filter(Boolean) as string[],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pet-neutral-900">펫용품거래</h1>
        <Link href="/post-item">
          <Button className="bg-pet-primary text-white hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            판매하기
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-pet-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="상품명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체 카테고리</SelectItem>
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="price_low">가격 낮은순</SelectItem>
              <SelectItem value="price_high">가격 높은순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <>
          <div className="text-sm text-pet-neutral-500 mb-4">
            총 {listings.length}개의 상품
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((listing: Listing) => (
              <ProductCard key={listing.id} listing={listing} />
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
            다른 검색어나 필터를 시도해보세요
          </p>
          <Link href="/post-item">
            <Button className="bg-pet-primary text-white hover:bg-orange-600">
              첫 번째 상품 등록하기
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
