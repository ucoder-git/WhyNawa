import { Link, useLocation } from "wouter";
import { ShoppingBasket, Plus, Scissors, Users, Home } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/marketplace",
      icon: ShoppingBasket,
      label: "펫용품거래",
      className: "bg-pet-primary text-white",
      active: location === "/marketplace"
    },
    {
      href: "/emergency",
      icon: Plus,
      label: "펫응급센터",
      className: "bg-pet-emergency text-white",
      active: location === "/emergency"
    },
    {
      href: "/services",
      icon: Scissors,
      label: "펫서비스",
      className: location === "/services" ? "bg-pet-secondary text-white" : "bg-pet-neutral-100 text-pet-neutral-900 hover:bg-pet-secondary hover:text-white",
      active: location === "/services"
    },
    {
      href: "/community",
      icon: Users,
      label: "펫커뮤니티",
      className: location === "/community" ? "bg-pet-secondary text-white" : "bg-pet-neutral-100 text-pet-neutral-900 hover:bg-pet-secondary hover:text-white",
      active: location === "/community"
    },
    {
      href: "/neighborhood",
      icon: Home,
      label: "동네생활",
      className: location === "/neighborhood" ? "bg-pet-secondary text-white" : "bg-pet-neutral-100 text-pet-neutral-900 hover:bg-pet-secondary hover:text-white",
      active: location === "/neighborhood"
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${item.className}`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
