import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import RentalsPage from "./pages/RentalsPage";
import HostelPage from "./pages/HostelPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import BuilderDashboard from "./pages/BuilderDashboard";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AuthModal from "./components/AuthModal";
import { useToast } from "./hooks/use-toast";

function AppContent() {
  const { user, login, register, googleSignIn, logout } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setShowAuthModal(false);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
      setShowAuthModal(false);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      await googleSignIn(credential);
      setShowAuthModal(false);
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Google sign-in failed",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  const handleShowLogin = () => {
    setShowAuthModal(true);
  };

  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar 
            user={user}
            onLogin={handleShowLogin}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleShowLogin} />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/rental/:id" element={<PropertyDetailPage />} />
            <Route path="/hostels" element={<HostelPage />} />
            <Route path="/hostel/:id" element={<PropertyDetailPage />} />
            <Route path="/pricing" element={<PricingPage onLogin={handleShowLogin} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/builder-dashboard" element={<BuilderDashboard />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onGoogleSignIn={handleGoogleSignIn}
          />
          <Toaster />
        </div>
      </Router>
    </AdminProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
