
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

function App() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
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
          onLogin={() => setIsAuthModalOpen(false)}
          onRegister={() => setIsAuthModalOpen(false)}
          onGoogleSignIn={() => setIsAuthModalOpen(false)}
        />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
