
import { AUTH_CONFIG } from "../config/auth";
import { LoginData, RegisterData, GoogleAuthData } from "../lib/validation";

interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
  hashedPassword?: string;
  googleId?: string;
  loginAttempts?: number;
  lockoutUntil?: Date;
  role?: 'user' | 'admin';
}

// Browser-compatible password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Browser-compatible password verification
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Browser-compatible JWT creation (simplified for demo)
function createToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = { ...payload, iat: now, exp: now + 3600 }; // 1 hour expiry
  
  const headerEncoded = btoa(JSON.stringify(header));
  const payloadEncoded = btoa(JSON.stringify(tokenPayload));
  
  return `${headerEncoded}.${payloadEncoded}.demo-signature`;
}

// Browser-compatible JWT verification (simplified for demo)
function verifyToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp < now) throw new Error('Token expired');
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Simulate a secure user store (in production, use a real database)
const users: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "user@demo.com",
    hashedPassword: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // password123
    plan: "Professional",
    projectsViewed: 5,
    projectsLimit: 10,
    loginAttempts: 0,
    role: "user"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@demo.com",
    hashedPassword: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // admin123
    plan: "Admin",
    loginAttempts: 0,
    role: "admin"
  }
];

export class AuthService {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static async login(data: LoginData): Promise<{ user: Omit<User, 'hashedPassword'>, token: string }> {
    const user = users.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new Error("Account temporarily locked. Please try again later.");
    }

    // Verify password
    const isValidPassword = await verifyPassword(data.password, user.hashedPassword || '');
    
    if (!isValidPassword) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        user.lockoutUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
        throw new Error("Too many failed attempts. Account locked for 15 minutes.");
      }
      
      throw new Error("Invalid credentials");
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockoutUntil = undefined;

    // Generate token
    const token = createToken({
      id: user.id, 
      email: user.email, 
      plan: user.plan,
      role: user.role
    });

    // Remove sensitive data
    const { hashedPassword: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  static async register(data: RegisterData): Promise<{ user: Omit<User, 'hashedPassword'>, token: string }> {
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const userHashedPassword = await hashPassword(data.password);

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      hashedPassword: userHashedPassword,
      projectsViewed: 0,
      projectsLimit: 0,
      loginAttempts: 0,
      role: "user"
    };

    users.push(newUser);

    // Generate token
    const token = createToken({
      id: newUser.id, 
      email: newUser.email, 
      plan: newUser.plan,
      role: newUser.role
    });

    // Remove sensitive data
    const { hashedPassword: _, ...userWithoutPassword } = newUser;
    
    return { user: userWithoutPassword, token };
  }

  static async googleAuth(data: GoogleAuthData): Promise<{ user: Omit<User, 'hashedPassword'>, token: string }> {
    try {
      // In production, verify the Google token here
      // For demo purposes, we'll simulate Google user data
      const googleUser = {
        id: "google_" + Date.now(),
        email: "google.user@gmail.com",
        name: "Google User",
        googleId: "google_123456789"
      };

      let user = users.find(u => u.email === googleUser.email);
      
      if (!user) {
        // Create new user from Google data
        user = {
          id: googleUser.id,
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId,
          projectsViewed: 0,
          projectsLimit: 0,
          loginAttempts: 0,
          role: "user"
        };
        users.push(user);
      }

      // Generate token
      const token = createToken({
        id: user.id, 
        email: user.email, 
        plan: user.plan,
        role: user.role
      });

      // Remove sensitive data
      const { hashedPassword: _, ...userWithoutPassword } = user;
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new Error("Google authentication failed");
    }
  }

  static verifyToken(token: string): any {
    return verifyToken(token);
  }
}
