import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { api, ApiError } from "./api-client";
import type { TokenResponse, UserResponse } from "../types/api";

const TOKEN_KEY = "erevive_access_token";
const REFRESH_KEY = "erevive_refresh_token";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }, []);

  const setTokens = useCallback(async (tokens: TokenResponse) => {
    await SecureStore.setItemAsync(TOKEN_KEY, tokens.access_token);
    await SecureStore.setItemAsync(REFRESH_KEY, tokens.refresh_token);
  }, []);

  const clearTokens = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  }, []);

  const fetchUser = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await api.get<UserResponse>("/users/me", { token });
      setUser(userData);
    } catch (err) {
      // Try refresh
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
        if (refreshToken) {
          const tokens = await api.post<TokenResponse>("/auth/refresh", {
            refresh_token: refreshToken,
          });
          await setTokens(tokens);
          const userData = await api.get<UserResponse>("/users/me", {
            token: tokens.access_token,
          });
          setUser(userData);
          return;
        }
      } catch {
        // Refresh also failed
      }
      await clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getToken, setTokens, clearTokens]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const tokens = await api.post<TokenResponse>("/auth/login", { email, password });
        await setTokens(tokens);
        await fetchUser();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Login failed";
        setError(message);
        throw err;
      }
    },
    [setTokens, fetchUser],
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string, phone?: string) => {
      setError(null);
      try {
        const tokens = await api.post<TokenResponse>("/auth/register", {
          email,
          password,
          full_name: fullName,
          phone: phone || null,
        });
        await setTokens(tokens);
        await fetchUser();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Registration failed";
        setError(message);
        throw err;
      }
    },
    [setTokens, fetchUser],
  );

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
  }, [clearTokens]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
