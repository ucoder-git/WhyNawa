import { useState } from "react";
import { Search, Bell, Heart, User, MapPin, ChevronDown, ShoppingBasket, Phone, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLocation, setCurrentLocation] = useState("서초4동");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Location */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🐾</div>
              <span className="text-xl font-bold text-pet-neutral-900">펫앤24</span>
            </Link>
            <div className="hidden sm:flex items-center space-x-1 text-pet-neutral-500 cursor-pointer">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{currentLocation}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Main Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/marketplace">
              <button className="flex items-center space-x-2 px-4 py-2 bg-pet-primary text-white rounded-lg hover:bg-pet-primary/90 transition-colors">
                <ShoppingBasket className="w-4 h-4" />
                <span className="font-medium">펫용품거래</span>
              </button>
            </Link>
            <Link href="/emergency">
              <button className="flex items-center space-x-2 px-4 py-2 bg-pet-emergency text-white rounded-lg hover:bg-red-600 transition-colors animate-pulse">
                <Heart className="w-4 h-4" />
                <span className="font-medium">🚨응급센터</span>
              </button>
            </Link>
            <Link href="/service-inquiry">
              <button className="flex items-center space-x-2 px-4 py-2 bg-pet-secondary text-white rounded-lg hover:bg-pet-secondary/90 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">서비스 문의</span>
              </button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="펫용품, 서비스를 검색해보세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Emergency Button */}
            <Link href="/emergency" className="lg:hidden">
              <button className="flex items-center space-x-1 px-3 py-2 bg-pet-emergency text-white rounded-lg hover:bg-red-600 transition-colors animate-pulse">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">응급</span>
              </button>
            </Link>

            <button className="p-2 text-pet-neutral-500 hover:text-pet-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-pet-neutral-500 hover:text-pet-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-pet-secondary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
