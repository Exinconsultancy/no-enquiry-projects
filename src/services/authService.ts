
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
}

// Simulate a secure user store (in production, use a real database)
const users: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "user@demo.com",
    hashedPassword: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    plan: "Professional",
    projectsViewed: 5,
    projectsLimit: 10,
    loginAttempts: 0
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@demo.com",
    hashedPassword: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
    plan: "Admin",
    loginAttempts: 0
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
    const isValidPassword = await bcrypt.compare(data.password, user.hashedPassword || '');
    
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        plan: user.plan 
      },
      AUTH_CONFIG.JWT_SECRET,
      { expiresIn: AUTH_CONFIG.TOKEN_EXPIRY }
    );

    // Remove sensitive data
    const { hashedPassword, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }

  static async register(data: RegisterData): Promise<{ user: Omit<User, 'hashedPassword'>, token: string }> {
    const existingUser = users.find(u => u.email === data.email);
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      hashedPassword,
      projectsViewed: 0,
      projectsLimit: 0,
      loginAttempts: 0
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        plan: newUser.plan 
      },
      AUTH_CONFIG.JWT_SECRET,
      { expiresIn: AUTH_CONFIG.TOKEN_EXPIRY }
    );

    // Remove sensitive data
    const { hashedPassword, ...userWithoutPassword } = newUser;
    
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
          loginAttempts: 0
        };
        users.push(user);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          plan: user.plan 
        },
        AUTH_CONFIG.JWT_SECRET,
        { expiresIn: AUTH_CONFIG.TOKEN_EXPIRY }
      );

      // Remove sensitive data
      const { hashedPassword, ...userWithoutPassword } = user;
      
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new Error("Google authentication failed");
    }
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
