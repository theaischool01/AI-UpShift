import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [signingOut, setSigningOut] = useState(false);

  // Fetch user profile from database with role verification
  const fetchProfile = useCallback(async (userId, authUser = null) => {
    if (!userId) {
      setProfile(null);
      setRole(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name, email, college_email, college, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[UpShift Auth] Profile fetch query notice:', error.message);
        const metaRole = authUser?.user_metadata?.role;
        if (metaRole === 'admin' || metaRole === 'learner') {
          const fallbackProfile = {
            id: userId,
            role: metaRole,
            full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0],
            email: authUser?.email,
          };
          setProfile(fallbackProfile);
          setRole(metaRole);
          return fallbackProfile;
        }
        return null;
      }

      if (!data) {
        const metaRole = authUser?.user_metadata?.role;
        if (metaRole === 'admin' || metaRole === 'learner') {
          const fallbackProfile = {
            id: userId,
            role: metaRole,
            full_name: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0],
            email: authUser?.email,
          };
          setProfile(fallbackProfile);
          setRole(metaRole);
          return fallbackProfile;
        }
        setProfile(null);
        setRole(null);
        return null;
      }

      if (data.role !== 'admin' && data.role !== 'learner') {
        console.error('[UpShift Auth] Invalid role detected in database profile:', data.role);
        await supabase.auth.signOut();
        setProfile(null);
        setRole(null);
        setAuthError('Your account is not configured correctly. Please contact an administrator.');
        return null;
      }

      setProfile(data);
      setRole(data.role);
      setAuthError(null);
      return data;
    } catch (err) {
      console.error('[UpShift Auth] Unexpected error fetching profile:', err);
      return null;
    }
  }, []);

  // Initialize session and single auth state change listener
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.warn('[UpShift Auth] Session retrieval error:', sessionError.message);
        }

        if (isMounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            await fetchProfile(initialSession.user.id, initialSession.user);
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
            setRole(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('[UpShift Auth] Initialization error:', err);
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !currentSession) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setSession(currentSession);
        setUser(currentSession.user);
        await fetchProfile(currentSession.user.id, currentSession.user);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Clean sign-out handler with concurrency protection
  const signOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[UpShift Auth] Error signing out:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(null);
      setAuthError(null);
      setLoading(false);
      setSigningOut(false);
    }
  }, [signingOut]);

  const value = {
    session,
    user,
    profile,
    role,
    loading,
    signingOut,
    authError,
    fetchProfile,
    signOut,
    isAuthenticated: !!user && !!role,
    isAdmin: role === 'admin',
    isLearner: role === 'learner',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
