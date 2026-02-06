import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  isPasswordRecovery: boolean;
  completePasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const completePasswordRecovery = () => {
    console.log('Completing password recovery - clearing recovery flag');
    sessionStorage.removeItem('password_recovery_flow');
    setIsPasswordRecovery(false);
  };

  useEffect(() => {
    // Get initial session with error handling for invalid tokens
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.log('Session error, clearing invalid tokens:', error.message);
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.log('Failed to get session, clearing tokens:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      // Check if we're in password recovery flow
      const checkRecoveryState = () => {
        const recoveryFlag = sessionStorage.getItem('password_recovery_flow');
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        
        console.log('Recovery state check:', { recoveryFlag, type, hash: window.location.hash });
        
        return recoveryFlag === 'true' || type === 'recovery' || isPasswordRecovery;
      };
      
      const isRecoveryFlow = checkRecoveryState();
      console.log('Is recovery flow:', isRecoveryFlow);
      
      if (isRecoveryFlow && event === 'SIGNED_IN') {
        console.log('Recovery session sign-in detected, redirecting to reset password page');
        setIsPasswordRecovery(true);
        // Set the recovery flag to ensure it persists
        sessionStorage.setItem('password_recovery_flow', 'true');
        // Redirect to reset password page
        if (window.location.pathname !== '/reset-password') {
          console.log('Redirecting to reset password page from auth state change');
          window.location.href = '/reset-password' + window.location.hash;
        }
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('SignOut error (session may already be invalid):', error);
    } finally {
      // Always clear local state regardless of API call success
      setSession(null);
      setUser(null);
      // Clear any recovery flags on sign out
      sessionStorage.removeItem('password_recovery_flow');
      setIsPasswordRecovery(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    // If signup successful and user was created, also create profile in users table
    if (!error && data.user) {
      try {
        const { error: profileError } = await supabase
          .from('users')
          .upsert([{
            user_id: data.user.id,
            email: email,
            name: userData.name,
            mobile_no: userData.mobile_no,
            age: userData.age,
            occupation: userData.occupation
          }]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail the signup for profile creation errors
        }
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the signup for profile creation errors
      }
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signIn,
    signUp,
    isPasswordRecovery,
    completePasswordRecovery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}