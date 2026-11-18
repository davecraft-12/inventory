import React, { useState, useEffect } from "react";
import { AuthContext } from "./auth-context";

const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const storedUser =
      localStorage.getItem("auth_user") || localStorage.getItem("pos_user");
    const storedToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("pos_token") ||
      localStorage.getItem("pos-token");

    if (storedUser && storedToken) {
      return { user: JSON.parse(storedUser), token: storedToken };
    }
  } catch {
    // Ignore malformed stored auth data and fall back to logged-out state.
  }

  return { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(readStoredAuth);
  const { user, token } = authState;
  const loading = false;

  useEffect(() => {
    const storedUser =
      localStorage.getItem("auth_user") || localStorage.getItem("pos_user");
    const storedToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("pos_token") ||
      localStorage.getItem("pos-token");
    const storedRefresh = localStorage.getItem("refreshToken");

    // Clean up any legacy keys when new ones exist
    if (storedToken) {
      localStorage.setItem("accessToken", storedToken);
      localStorage.removeItem("pos_token");
      localStorage.removeItem("pos-token");
    }
    if (storedUser) {
      localStorage.setItem("auth_user", storedUser);
      localStorage.removeItem("pos_user");
    }
    if (storedRefresh) {
      localStorage.setItem("refreshToken", storedRefresh);
    }
  }, []);

  const setUser = (nextUser) => {
    setAuthState((prev) => ({
      ...prev,
      user: typeof nextUser === "function" ? nextUser(prev.user) : nextUser,
    }));
  };

  const login = (userData, accessToken, refreshToken) => {
    setAuthState({ user: userData, token: accessToken });
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("auth_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pos_user");
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos-token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
