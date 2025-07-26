
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building, Search, User, Menu, X, Settings } from "lucide-react";

interface NavbarProps {
  user?: { name: string; email: string; plan?: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ user, onLogin, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">NoNo Broker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/properties"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/properties") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Properties</span>
            </Link>
            <Link
              to="/rentals"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/rentals") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Rentals</span>
            </Link>
            {user?.plan === 'Builder' && (
              <Link
                to="/builder-dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/builder-dashboard") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              to="/pricing"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/pricing") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
              }`}
            >
              <span>Plans</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.plan && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {user.plan}
                  </span>
                )}
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-accent px-3 py-2 rounded-md transition-colors">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin}>Login</Button>
            )}
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/properties") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/rentals"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/rentals") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Rentals
              </Link>
              {user?.plan === 'Builder' && (
                <Link
                  to="/builder-dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/builder-dashboard") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/pricing"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/pricing") ? "text-primary bg-accent" : "text-foreground hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Plans
              </Link>
              <div className="border-t border-border pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/profile" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      {user.plan && (
                        <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {user.plan}
                        </span>
                      )}
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full mx-3"
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full mx-3"
                    onClick={() => {
                      onLogin();
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
      </div>
    </nav>
  );
};

export default Navbar;
