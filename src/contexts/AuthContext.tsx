import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// =====================================================
// Types
// =====================================================

interface V2Enrollment {
  id: string;
  course_id: string;
  batch_id: string | null;
  enrollment_type: 'free' | 'paid' | 'group';
  enrollment_status: string;
  payment_status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signInWithOAuth: (provider: Provider, redirectTo?: string) => Promise<{ error: any }>;
  isPasswordRecovery: boolean;
  completePasswordRecovery: () => void;
  // V2 enrollment awareness
  v2Enrollment: V2Enrollment | null;
  hasV2Enrollment: boolean;
  isLegacyStudent: boolean;
  refreshEnrollment: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================
// Batch #101 Auto-Assign (Free Signup)
// =====================================================
// When a new user signs up (email or OAuth), automatically create a
// student_enrollments_v2 record with enrollment_type='free' and
// assign to the default free batch (BATCH101).
// This runs silently in the background - errors do NOT block signup.

async function ensureFreeEnrollment(email: string): Promise<V2Enrollment | null> {
  try {
    // Check if V2 enrollment already exists
    const { data: existing } = await supabase
      .from('student_enrollments_v2')
      .select('id, course_id, batch_id, enrollment_type, enrollment_status, payment_status')
      .eq('student_email', email.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (existing) {
      return existing as V2Enrollment;
    }

    // Look up the default free batch (BATCH101)
    const { data: freeBatch } = await supabase
      .from('batches_v2')
      .select('id, course_id')
      .eq('batch_code', 'BATCH101')
      .eq('is_active', true)
      .maybeSingle();

    if (!freeBatch) {
      console.log('No free batch (BATCH101) found - skipping auto-enrollment');
      return null;
    }

    // Create free enrollment
    const { data: enrollment, error } = await supabase
      .from('student_enrollments_v2')
      .insert({
        student_email: email.toLowerCase(),
        course_id: freeBatch.course_id,
        batch_id: freeBatch.id,
        enrollment_type: 'free',
        payment_type: 'free',
        payment_status: 'not_required',
        enrollment_status: 'active',
        currency: 'INR',
      })
      .select('id, course_id, batch_id, enrollment_type, enrollment_status, payment_status')
      .single();

    if (error) {
      // Could be a race condition (duplicate) - fetch existing
      console.log('Auto-enrollment insert failed (may already exist):', error.message);
      const { data: retry } = await supabase
        .from('student_enrollments_v2')
        .select('id, course_id, batch_id, enrollment_type, enrollment_status, payment_status')
        .eq('student_email', email.toLowerCase())
        .limit(1)
        .maybeSingle();
      return retry as V2Enrollment | null;
    }

    console.log('Free enrollment created for:', email);
    return enrollment as V2Enrollment;
  } catch (err) {
    console.error('Error in ensureFreeEnrollment:', err);
    return null;
  }
}

// =====================================================
// Provider
// =====================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // V2 enrollment state
  const [v2Enrollment, setV2Enrollment] = useState<V2Enrollment | null>(null);
  const [isLegacyStudent, setIsLegacyStudent] = useState(false);

  const completePasswordRecovery = () => {
    console.log('Completing password recovery - clearing recovery flag');
    sessionStorage.removeItem('password_recovery_flow');
    setIsPasswordRecovery(false);
  };

  // Fetch enrollment data for the current user
  const fetchEnrollmentData = async (email: string) => {
    try {
      // Check V2 enrollment first
      const { data: v2Data } = await supabase
        .from('student_enrollments_v2')
        .select('id, course_id, batch_id, enrollment_type, enrollment_status, payment_status')
        .eq('student_email', email.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (v2Data) {
        setV2Enrollment(v2Data as V2Enrollment);
      } else {
        setV2Enrollment(null);
      }

      // Check legacy student_master_table
      const { data: legacyData } = await supabase
        .from('student_master_table')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      setIsLegacyStudent(!!legacyData);
    } catch (err) {
      console.error('Error fetching enrollment data:', err);
    }
  };

  const refreshEnrollment = async () => {
    if (user?.email) {
      await fetchEnrollmentData(user.email);
    }
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
          // Fetch enrollment data on initial load
          if (session?.user?.email) {
            fetchEnrollmentData(session.user.email);
          }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

      // On new sign-in, ensure free enrollment exists and fetch enrollment data
      if (event === 'SIGNED_IN' && session?.user?.email) {
        // Run auto-enrollment in background (non-blocking)
        ensureFreeEnrollment(session.user.email).then((enrollment) => {
          if (enrollment) {
            setV2Enrollment(enrollment);
          }
        });
        fetchEnrollmentData(session.user.email);
      }

      // Clear enrollment data on sign-out
      if (event === 'SIGNED_OUT') {
        setV2Enrollment(null);
        setIsLegacyStudent(false);
      }
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
      setV2Enrollment(null);
      setIsLegacyStudent(false);
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

      // Auto-assign free enrollment (Batch #101) in background
      ensureFreeEnrollment(email).then((enrollment) => {
        if (enrollment) {
          setV2Enrollment(enrollment);
        }
      });
    }

    return { error };
  };

  const signInWithOAuth = async (provider: Provider, redirectTo?: string) => {
    const redirectUrl = `${window.location.origin}/auth/callback${
      redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''
    }`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    signIn,
    signUp,
    signInWithOAuth,
    isPasswordRecovery,
    completePasswordRecovery,
    // V2 enrollment awareness
    v2Enrollment,
    hasV2Enrollment: !!v2Enrollment,
    isLegacyStudent,
    refreshEnrollment,
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
