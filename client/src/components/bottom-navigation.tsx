import { Link, useLocation } from "wouter";
import { Home, ShoppingBasket, Plus, Users, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "홈", isActive: location === "/" },
    { href: "/marketplace", icon: ShoppingBasket, label: "중고거래", isActive: location === "/marketplace" },
    { href: "/emergency", icon: Plus, label: "응급센터", isActive: location === "/emergency", isEmergency: true },
    { href: "/community", icon: Users, label: "커뮤니티", isActive: location === "/community" },
    { href: "/profile", icon: User, label: "내정보", isActive: location === "/profile" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const textColor = item.isActive 
            ? (item.isEmergency ? "text-pet-emergency" : "text-pet-primary")
            : "text-pet-neutral-500";
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center ${textColor} transition-colors`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
