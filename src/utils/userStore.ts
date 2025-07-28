
import { hashPassword, verifyPassword } from './passwordUtils';

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
  role: 'user' | 'admin';
  loginAttempts: number;
  lockoutUntil?: number;
  createdAt: number;
}

// Secure user store - in production, this would be a database
let users: User[] = [];

// Initialize with secure admin user
async function initializeUsers() {
  if (users.length === 0) {
    // Create admin user with secure password
    const adminPassword = await hashPassword('SecureAdmin123!');
    const userPassword = await hashPassword('SecureUser123!');
    
    users = [
      {
        id: "admin-001",
        name: "System Administrator",
        email: "admin@demo.com",
        passwordHash: adminPassword.hash,
        passwordSalt: adminPassword.salt,
        plan: "Admin",
        projectsViewed: 0,
        projectsLimit: 999999,
        role: "admin",
        loginAttempts: 0,
        createdAt: Date.now()
      },
      {
        id: "user-001",
        name: "Demo User",
        email: "user@demo.com",
        passwordHash: userPassword.hash,
        passwordSalt: userPassword.salt,
        plan: "Professional",
        projectsViewed: 5,
        projectsLimit: 10,
        role: "user",
        loginAttempts: 0,
        createdAt: Date.now()
      }
    ];
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeUsers();
  return users.find(u => u.email === email) || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  await initializeUsers();
  
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password securely
  const { hash, salt } = await hashPassword(userData.password);
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    passwordHash: hash,
    passwordSalt: salt,
    plan: "Starter",
    projectsViewed: 0,
    projectsLimit: 3,
    role: "user",
    loginAttempts: 0,
    createdAt: Date.now()
  };
  
  users.push(newUser);
  return newUser;
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  await initializeUsers();
  
  const user = await getUserByEmail(email);
  if (!user) return null;
  
  // Check if account is locked
  if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
    throw new Error('Account temporarily locked. Please try again later.');
  }
  
  const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  
  if (!isValid) {
    // Increment login attempts
    user.loginAttempts++;
    
    if (user.loginAttempts >= 5) {
      user.lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
      throw new Error('Too many failed attempts. Account locked for 15 minutes.');
    }
    
    return null;
  }
  
  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockoutUntil = undefined;
  
  return user;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  await initializeUsers();
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  // Don't allow updating sensitive fields
  const { passwordHash, passwordSalt, role, ...safeUpdates } = updates;
  
  users[userIndex] = { ...users[userIndex], ...safeUpdates };
  return users[userIndex];
}
