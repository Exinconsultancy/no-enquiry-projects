import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building, Search, User, Menu, X, Settings, Hammer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { user, profile, logout } = useAuth();


  return (
    <>
      <nav className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="Listing homes" 
                  className="h-10 w-10"
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/properties"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/properties" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Properties</span>
              </Link>
              <Link
                to="/rentals"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/rentals" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Rentals</span>
              </Link>
              <Link
                to="/hostels"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/hostels" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Hostels</span>
              </Link>
              <Link
                to="/pricing"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/pricing" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span>Pricing</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span>{profile?.display_name || user?.email}</span>
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/adproplisthmx"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  {profile?.role === 'builder' && (
                    <Link
                      to="/builder-dashboard"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      <Hammer className="h-4 w-4" />
                      <span>Builder Dashboard</span>
                    </Link>
                  )}
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Login
                </Button>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/properties"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === "/properties" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Building className="h-4 w-4" />
                <span>Properties</span>
              </Link>
              <Link
                to="/rentals"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === "/rentals" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Rentals</span>
              </Link>
              <Link
                to="/hostels"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === "/hostels" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Building className="h-4 w-4" />
                <span>Hostels</span>
              </Link>
              <Link
                to="/pricing"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === "/pricing" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Pricing</span>
              </Link>
              
              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>{profile?.display_name || user?.email}</span>
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/adproplisthmx"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    {profile?.role === 'builder' && (
                      <Link
                        to="/builder-dashboard"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Hammer className="h-4 w-4" />
                        <span>Builder Dashboard</span>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full justify-start"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Handle successful auth
        }}
      />
    </>
  );
};

export default Navbar;
