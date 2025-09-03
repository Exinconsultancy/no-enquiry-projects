
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { BuilderProvider } from "./contexts/BuilderContext";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import RentalsPage from "./pages/RentalsPage";
import HostelPage from "./pages/HostelPage";
import PricingPage from "./pages/PricingPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import BuilderDashboard from "./pages/BuilderDashboard";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import AdminRouteGuard from "./components/AdminRouteGuard";
import BuilderRouteGuard from "./components/BuilderRouteGuard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <BuilderProvider>
            <MaintenanceProvider>
              <FavoritesProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/rentals" element={<RentalsPage />} />
                    <Route path="/hostels" element={<HostelPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/adproplisthmx" element={
                      <AdminRouteGuard>
                        <AdminPage />
                      </AdminRouteGuard>
                    } />
                    <Route path="/builder-dashboard" element={
                      <BuilderRouteGuard>
                        <BuilderDashboard />
                      </BuilderRouteGuard>
                    } />
                    <Route path="/property/:id" element={<PropertyDetailPage />} />
                    <Route path="/rental/:id" element={<PropertyDetailPage />} />
                    <Route path="/hostel/:id" element={<PropertyDetailPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
              </FavoritesProvider>
            </MaintenanceProvider>
          </BuilderProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
