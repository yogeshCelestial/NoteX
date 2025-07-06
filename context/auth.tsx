'use client'

import { httpHelper } from "@/lib/httpHelper";
import { Response } from "@/lib/httpHelper";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  created_at: string,
  updated_at: string,
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const success = (response: Response) => {
    // Assuming the user data is in response.data
    setUser(response.data as User);
    setLoading(false);
  }

  const failed = (error: Error) => {
    console.log(error.message);
    setUser(null);
    setLoading(false);
  }

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const http = {
        endpoint: '/api/auth/me',
        method: 'GET',
      }
      await httpHelper(http, success, failed);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
