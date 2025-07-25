import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Sample users for demo
  const sampleUsers = [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "user@demo.com",
      password: "password123",
      plan: "Professional",
      projectsViewed: 5,
      projectsLimit: 10
    },
    {
      id: "2",
      name: "Admin User",
      email: "admin@demo.com",
      password: "admin123",
      plan: "Admin"
    }
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = sampleUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const user: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        plan: foundUser.plan,
        projectsViewed: foundUser.projectsViewed,
        projectsLimit: foundUser.projectsLimit
      };
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = sampleUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      projectsViewed: 0,
      projectsLimit: 0
    };
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};