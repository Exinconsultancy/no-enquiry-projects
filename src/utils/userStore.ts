
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  plan?: string;
  projectsViewed?: number;
  projectsLimit?: number;
  subscriptionExpiry?: string;
  createdAt: string;
}

// In-memory user store (replace with actual database in production)
const users: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = users.find(u => u.email === email);
  return user || null;
};

export const createUser = async (userData: { 
  name: string; 
  email: string; 
  password: string; 
}): Promise<User> => {
  // Check if user already exists
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password, // In production, this should be hashed
    role: "user",
    createdAt: new Date().toISOString()
    // No automatic plan assignment
  };

  users.push(newUser);
  return newUser;
};

export const verifyUserPassword = async (email: string, password: string): Promise<User | null> => {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

export const getAllUsers = (): User[] => {
  return users;
};
