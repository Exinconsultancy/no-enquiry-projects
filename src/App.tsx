
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SecureAuthProvider } from "./contexts/SecureAuthContext";
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
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import AdminRouteGuard from "./components/AdminRouteGuard";

function App() {
  return (
    <SecureAuthProvider>
      <AdminProvider>
        <FavoritesProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/rentals" element={<RentalsPage />} />
                <Route path="/hostels" element={<HostelPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={
                  <AdminRouteGuard>
                    <AdminPage />
                  </AdminRouteGuard>
                } />
                <Route path="/builder-dashboard" element={
                  <AdminRouteGuard>
                    <BuilderDashboard />
                  </AdminRouteGuard>
                } />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/rental/:id" element={<PropertyDetailPage />} />
                <Route path="/hostel/:id" element={<PropertyDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </FavoritesProvider>
      </AdminProvider>
    </SecureAuthProvider>
  );
}

export default App;
