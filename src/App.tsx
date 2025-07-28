import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import RentalsPage from "./pages/RentalsPage";
import HostelPage from "./pages/HostelPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import BuilderDashboard from "./pages/BuilderDashboard";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import NotFound from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check for user in local storage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    setIsAuthModalOpen(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data on logout
  };

  return (
    <AuthProvider>
      <AdminProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <HomePage onLogin={handleLoginClick} />
                  </>
                } />
                <Route path="/properties" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <PropertiesPage />
                  </>
                } />
                <Route path="/rentals" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <RentalsPage />
                  </>
                } />
                <Route path="/hostels" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <HostelPage />
                  </>
                } />
                <Route path="/pricing" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <PricingPage onLogin={handleLoginClick} />
                  </>
                } />
                <Route path="/profile" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <ProfilePage />
                  </>
                } />
                <Route path="/admin" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <AdminPage />
                  </>
                } />
                <Route path="/builder-dashboard" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <BuilderDashboard />
                  </>
                } />
                <Route path="/property/:id" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <PropertyDetailPage />
                  </>
                } />
                <Route path="/rental/:id" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <PropertyDetailPage />
                  </>
                } />
                <Route path="/hostel/:id" element={
                  <>
                    <Navbar user={user} onLogin={handleLoginClick} onLogout={handleLogout} />
                    <PropertyDetailPage />
                  </>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleAuthModalClose}
                onLogin={handleLogin}
                onRegister={handleRegister}
              />
            </div>
          </Router>
        </FavoritesProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
