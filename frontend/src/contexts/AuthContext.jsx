import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on load
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
        } catch (error) {
          console.error("Failed to load user profile", error);
          localStorage.removeItem("access_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      const profile = await authApi.getMe();
      setUser(profile);
    }
  };

  const googleLogin = async (idToken) => {
    const data = await authApi.googleLogin(idToken);
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      const profile = await authApi.getMe();
      setUser(profile);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
