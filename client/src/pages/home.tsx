import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import EmergencyCenterCard from "@/components/emergency-center-card";
import ServiceCard from "@/components/service-card";
import CommunityPostCard from "@/components/community-post-card";
import { ChevronRight, Package, Scissors, Home, Car, Heart, Plus } from "lucide-react";

export default function HomePage() {
  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ["/api/listings?limit=4"],
  });

  const { data: emergencyHospitals, isLoading: hospitalsLoading } = useQuery({
    queryKey: ["/api/emergency-hospitals?limit=3"],
  });

  const { data: petServices, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/pet-services?limit=4"],
  });

  const { data: communityPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community-posts?limit=3"],
  });

  const categories = [
    { icon: Package, name: "사료", href: "/marketplace?category=food" },
    { icon: "🎾", name: "장난감", href: "/marketplace?category=toys" },
    { icon: Home, name: "하우스", href: "/marketplace?category=house" },
    { icon: "👕", name: "의류", href: "/marketplace?category=clothing" },
    { icon: "🩺", name: "의료용품", href: "/marketplace?category=medical" },
    { icon: Scissors, name: "미용용품", href: "/marketplace?category=grooming" },
    { icon: Car, name: "이동용품", href: "/marketplace?category=transport" },
    { icon: Plus, name: "기타", href: "/marketplace?category=others" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Hero Section */}
      <section className="mb-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-400 to-pet-secondary h-48 sm:h-64">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-4">
              우리동네 펫케어<br />
              <span className="text-yellow-300">모든 것</span>이 여기에
            </h1>
            <div className="flex flex-wrap gap-3">
              <Link href="/marketplace">
                <Button className="bg-white text-pet-primary hover:bg-gray-100">
                  펫용품 둘러보기
                </Button>
              </Link>
              <Link href="/emergency">
                <Button className="bg-pet-emergency text-white hover:bg-red-600">
                  응급센터 찾기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pet-neutral-900">인기 펫용품 카테고리</h2>
          <Link href="/marketplace" className="text-pet-primary text-sm font-medium flex items-center">
            전체보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-center group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-pet-neutral-100 rounded-full flex items-center justify-center group-hover:bg-pet-secondary transition-colors">
                {typeof category.icon === 'string' ? (
                  <span className="text-xl">{category.icon}</span>
                ) : (
                  <category.icon className="w-5 h-5 text-pet-primary group-hover:text-white" />
                )}
              </div>
              <span className="text-sm text-pet-neutral-500 group-hover:text-pet-primary">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pet-neutral-900">우리동네 최신 펫용품</h2>
          <Link href="/marketplace" className="text-pet-primary text-sm font-medium flex items-center">
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {listingsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.slice(0, 4).map((listing: any) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pet-neutral-500">
            등록된 펫용품이 없습니다.
          </div>
        )}
      </section>

      {/* Emergency Services */}
      <section className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🚑</span>
            <h2 className="text-xl font-bold text-pet-neutral-900">24시간 펫응급센터</h2>
          </div>
          <Link href="/emergency" className="text-pet-emergency text-sm font-medium flex items-center">
            전체보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {hospitalsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        ) : emergencyHospitals && emergencyHospitals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyHospitals.slice(0, 3).map((hospital: any) => (
              <EmergencyCenterCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pet-neutral-500">
            등록된 응급센터가 없습니다.
          </div>
        )}
      </section>

      {/* Local Services */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pet-neutral-900">우리동네 펫서비스</h2>
          <Link href="/services" className="text-pet-primary text-sm font-medium flex items-center">
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {servicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        ) : petServices && petServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {petServices.slice(0, 4).map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pet-neutral-500">
            등록된 펫서비스가 없습니다.
          </div>
        )}
      </section>

      {/* Community Posts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pet-neutral-900">펫커뮤니티</h2>
          <Link href="/community" className="text-pet-primary text-sm font-medium flex items-center">
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        ) : communityPosts && communityPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityPosts.slice(0, 3).map((post: any) => (
              <CommunityPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-pet-neutral-500">
            등록된 커뮤니티 글이 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}
