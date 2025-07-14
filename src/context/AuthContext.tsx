import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  patientReady: boolean;
  onboardingCompleted: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshOnboardingStatus: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientReady, setPatientReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const supaUser = session.user;
          const loadedUser = {
            id: supaUser.id,
            email: supaUser.email!,
            name: supaUser.email!.split("@")[0],
          };
          setUser(loadedUser);
          checkPatientExists(supaUser.id);
        } else {
          setUser(null);
          setPatientReady(false);
          setOnboardingCompleted(false);
        }
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkPatientExists = async (userId: string) => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, onboarding_completed")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setPatientReady(true);
      setOnboardingCompleted(data.onboarding_completed || false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error || !data.user) throw error;

      const supaUser = data.user;
      const newUser = {
        id: supaUser.id,
        email: supaUser.email!,
        name: supaUser.email!.split("@")[0],
      };
      setUser(newUser);

      const { error: patientError } = await supabase
        .from("patients")
        .upsert(
          { id: newUser.id, full_name: newUser.name },
          { onConflict: "id" }
        );

      if (!patientError) setPatientReady(true);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('🚀 Starting signup process for:', email);
    setLoading(true);
    try {
      console.log('📧 Calling Supabase auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });
      
      console.log('📊 Supabase signup response:', { data, error });
      
      if (error || !data.user) {
        console.error('❌ Supabase signup error:', error);
        throw error;
      }

      console.log('✅ User created successfully:', data.user.id);
      
      const supaUser = data.user;
      const newUser = {
        id: supaUser.id,
        email: supaUser.email!,
        name,
      };
      setUser(newUser);

      console.log('👤 Creating patient record...');
      const { error: patientError } = await supabase
        .from("patients")
        .upsert({ id: newUser.id, full_name: name }, { onConflict: "id" });

      if (patientError) {
        console.error('❌ Patient creation error:', patientError);
      } else {
        console.log('✅ Patient record created successfully');
        setPatientReady(true);
      }
    } catch (signupError) {
      console.error('💥 Signup process failed:', signupError);
      throw signupError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPatientReady(false);
    setOnboardingCompleted(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshOnboardingStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("patients")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setOnboardingCompleted(data.onboarding_completed || false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        patientReady,
        onboardingCompleted,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        refreshOnboardingStatus,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
