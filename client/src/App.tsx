import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Emergency from "@/pages/emergency";
import Services from "@/pages/services";
import Community from "@/pages/community";
import PostItem from "@/pages/post-item";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import BottomNavigation from "@/components/bottom-navigation";
import EmergencyQuickAccess from "@/components/emergency-quick-access";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/emergency" component={Emergency} />
        <Route path="/services" component={Services} />
        <Route path="/community" component={Community} />
        <Route path="/post-item" component={PostItem} />
        <Route component={NotFound} />
      </Switch>
      <EmergencyQuickAccess />
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
