"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { TokenResponse, UserResponse } from "@/types/api";

const TOKEN_KEY = "erevive_access_token";
const REFRESH_KEY = "erevive_refresh_token";

export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  };

  const setTokens = (tokens: TokenResponse) => {
    localStorage.setItem(TOKEN_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  };

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await api.get<UserResponse>("/users/me", { token });
      setUser(userData);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const tokens = await api.post<TokenResponse>("/auth/login", { email, password });
      setTokens(tokens);
      await fetchUser();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  };

  const register = async (email: string, password: string, fullName: string, phone?: string) => {
    setError(null);
    try {
      const tokens = await api.post<TokenResponse>("/auth/register", {
        email,
        password,
        full_name: fullName,
        phone: phone || null,
      });
      setTokens(tokens);
      await fetchUser();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Registration failed";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return { user, loading, error, login, register, logout, getToken };
}
