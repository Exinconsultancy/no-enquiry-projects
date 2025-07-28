
interface SessionData {
  id: string;
  email: string;
  role: string;
  expiresAt: number;
  sessionToken: string;
}

const SESSION_KEY = 'auth_session';
const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export function createSession(user: { id: string; email: string; role: string }): string {
  const sessionToken = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION;
  
  const sessionData: SessionData = {
    id: user.id,
    email: user.email,
    role: user.role,
    expiresAt,
    sessionToken
  };
  
  // Store in localStorage (in production, use httpOnly cookies)
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  
  return sessionToken;
}

export function getSession(): SessionData | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    const session: SessionData = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session retrieval failed:', error);
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function refreshSession(): boolean {
  const session = getSession();
  if (!session) return false;
  
  // Extend session expiry
  session.expiresAt = Date.now() + SESSION_DURATION;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return true;
}
