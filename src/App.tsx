
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PropertiesPage from '@/pages/PropertiesPage';
import PricingPage from '@/pages/PricingPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import AuthModal from '@/components/AuthModal';
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import RentalsPage from '@/pages/RentalsPage';
import BuilderDashboard from '@/pages/BuilderDashboard';
import HostelPage from '@/pages/HostelPage';
import { useToast } from '@/hooks/use-toast';

function App() {
  const { user, login, register, googleSignIn, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const handleAuthLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsAuthModalOpen(false);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAuthRegister = async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
      setIsAuthModalOpen(false);
      toast({
        title: "Registration Successful",
        description: "Welcome to NoNo Broker!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async (credential: string) => {
    try {
      await googleSignIn(credential);
      setIsAuthModalOpen(false);
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome to NoNo Broker!",
      });
    } catch (error) {
      toast({
        title: "Google Sign-In Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage onLogin={handleLogin} />} />
          <Route path="/properties" element={<PropertiesPage onLogin={handleLogin} />} />
          <Route path="/hostels" element={<HostelPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/pricing" element={<PricingPage onLogin={handleLogin} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/builder-dashboard" element={<BuilderDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleAuthLogin}
          onRegister={handleAuthRegister}
          onGoogleSignIn={handleGoogleSignIn}
        />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
