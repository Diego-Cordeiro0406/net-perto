/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { AuthError, Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface SignInResult {
  error: AuthError | null;
}

interface AuthContextData {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;

  signIn: (email: string, password: string) => Promise<SignInResult>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [session, setSession] = useState<Session | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);

  const checkIsAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao verificar permissões:", error);

      return false;
    }

    return Boolean(data);
  };

  const updateAuthState = async (currentSession: Session | null) => {
    const currentUser = currentSession?.user ?? null;

    setSession(currentSession);
    setUser(currentUser);

    if (!currentUser) {
      setIsAdmin(false);

      return;
    }

    const admin = await checkIsAdmin(currentUser.id);

    setIsAdmin(admin);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao recuperar sessão:", error);
      }

      await updateAuthState(data.session);

      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await updateAuthState(session);

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }

  return context;
}
