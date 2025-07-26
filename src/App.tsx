
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import RentalsPage from "./pages/RentalsPage";
import AdminPage from "./pages/AdminPage";
import BuilderDashboard from "./pages/BuilderDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, login, register, googleSignIn, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsAuthModalOpen(false);
      toast({
        title: "Welcome back!",
        description: `Logged in successfully as ${email}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
      setIsAuthModalOpen(false);
      toast({
        title: "Account created!",
        description: "Welcome to NoNo Broker. Start exploring premium properties.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      await googleSignIn(credential);
      setIsAuthModalOpen(false);
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      });
    } catch (error) {
      toast({
        title: "Google Sign-In failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  // Check if current route is admin or builder dashboard
  const isAdminRoute = location.pathname.includes("/admin");
  const isBuilderDashboard = location.pathname.includes("/builder-dashboard");
  
  // Admin route protection
  if (isAdminRoute && (!user || user.plan !== "Admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-destructive">Access Denied</h1>
          <p className="text-xl text-muted-foreground mb-4">
            This is a private admin area. Access is restricted.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAdminRoute && !isBuilderDashboard && (
        <Navbar 
          user={user} 
          onLogin={openAuthModal} 
          onLogout={handleLogout} 
        />
      )}
      
      <Routes>
        <Route path="/" element={<HomePage user={user} onLogin={openAuthModal} />} />
        <Route path="/properties" element={<PropertiesPage onLogin={openAuthModal} />} />
        <Route path="/pricing" element={<PricingPage onLogin={openAuthModal} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/rentals" element={<RentalsPage user={user} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/builder-dashboard" element={<BuilderDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
