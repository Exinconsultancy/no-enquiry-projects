
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SecureAuthService } from "../services/secureAuthService";
import { loginSchema, registerSchema, LoginData, RegisterData } from "../lib/validation";
import { getSession, refreshSession } from "../utils/sessionUtils";

interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
  role: string;
}

interface SecureAuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error("useSecureAuth must be used within a SecureAuthProvider");
  }
  return context;
};

interface SecureAuthProviderProps {
  children: ReactNode;
}

export const SecureAuthProvider = ({ children }: SecureAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = getSession();
    if (session) {
      setUser({
        id: session.id,
        email: session.email,
        name: '', // Would fetch from user store in production
        role: session.role
      });
    }
    setIsLoading(false);
    
    // Set up session refresh interval
    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const validatedData = loginSchema.parse({ email, password });
      const { user: loggedInUser } = await SecureAuthService.login(validatedData);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const validatedData = registerSchema.parse({ email, password, name });
      const { user: registeredUser } = await SecureAuthService.register(validatedData);
      setUser(registeredUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    SecureAuthService.logout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAuthenticated = user !== null;
  const isAdmin = hasRole('admin');

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
    hasRole,
    isAdmin
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};
