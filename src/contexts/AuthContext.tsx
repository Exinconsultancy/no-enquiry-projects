
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthService } from "../services/authService";
import { loginSchema, registerSchema, LoginData, RegisterData } from "../lib/validation";

interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleSignIn: (credential: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (savedToken && savedUser) {
      try {
        // Verify token is still valid
        AuthService.verifyToken(savedToken);
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Validate input
      const validatedData = loginSchema.parse({ email, password });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { user, token } = await AuthService.login(validatedData);
      
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Validate input
      const validatedData = registerSchema.parse({ email, password, name });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { user, token } = await AuthService.register(validatedData);
      
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async (credential: string) => {
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { user, token } = await AuthService.googleAuth({
        credential,
        clientId: "your-google-client-id"
      });
      
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    login,
    register,
    googleSignIn,
    logout,
    isLoading,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
