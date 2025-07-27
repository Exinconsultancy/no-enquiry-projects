import React, { useState, useEffect } from 'react';
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
  const { user, setUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
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
          onLogin={setUser} 
        />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
