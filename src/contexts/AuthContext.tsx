
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
  subscriptionExpiry?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleSignIn: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateUserName: (newName: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  token: string | null;
  isAdmin: boolean;
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

  const isAdmin = user?.role === 'admin';

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

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateUserName = async (newName: string) => {
    if (!user) throw new Error("No user logged in");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser({ name: newName });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("No user logged in");
    
    // Simulate API call with validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would validate current password and update it
    console.log(`Password changed for user ${user.email}`);
  };

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
    updateUser,
    updateUserName,
    changePassword,
    isLoading,
    token,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
