
import { LoginData, RegisterData } from "../lib/validation";
import { getUserByEmail, createUser, verifyUserPassword } from "../utils/userStore";
import { createSession, getSession, clearSession } from "../utils/sessionUtils";

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    plan?: string;
    projectsViewed?: number;
    projectsLimit?: number;
    role: string;
  };
  sessionToken: string;
}

export class SecureAuthService {
  static async login(data: LoginData): Promise<AuthResult> {
    try {
      const user = await verifyUserPassword(data.email, data.password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Create secure session
      const sessionToken = createSession({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          projectsViewed: user.projectsViewed,
          projectsLimit: user.projectsLimit,
          role: user.role
        },
        sessionToken
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      const user = await createUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      // Create secure session
      const sessionToken = createSession({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          projectsViewed: user.projectsViewed,
          projectsLimit: user.projectsLimit,
          role: user.role
        },
        sessionToken
      };
    } catch (error) {
      throw error;
    }
  }
  
  static getCurrentUser(): AuthResult['user'] | null {
    const session = getSession();
    if (!session) return null;
    
    return {
      id: session.id,
      email: session.email,
      name: '', // Would need to fetch from user store
      role: session.role
    };
  }
  
  static logout(): void {
    clearSession();
  }
  
  static isAuthenticated(): boolean {
    return getSession() !== null;
  }
  
  static hasRole(role: string): boolean {
    const session = getSession();
    return session?.role === role;
  }
}
