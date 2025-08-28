import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user signs in
        if (session?.user) {
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            setProfile(profile);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string) => {
    const redirectUrl = `https://sapnokaghar.com/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: name,
        },
      },
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      console.log('Requesting password reset for:', email);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://sapnokaghar.com/reset-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        
        // Handle specific error cases
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          throw new Error("Too many password reset attempts. Please wait 60 seconds before trying again.");
        }
        
        if (error.message.includes('Invalid email')) {
          throw new Error("Please enter a valid email address.");
        }
        
        if (error.message.includes('User not found')) {
          throw new Error("No account found with this email address.");
        }
        
        if (error.message.includes('email rate limit exceeded')) {
          throw new Error("Email rate limit exceeded. Please wait a few minutes before requesting another reset link.");
        }
        
        throw new Error(`Unable to send reset email: ${error.message}`);
      }
      
      console.log('Password reset email sent successfully:', data);
      
      // Function returns void, success is indicated by no error thrown
    } catch (error: any) {
      console.error('Reset password catch:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    profile,
    login,
    register,
    resetPassword,
    logout,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};