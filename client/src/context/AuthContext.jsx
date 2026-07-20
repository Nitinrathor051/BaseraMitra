import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(false);

  // -------------------------
  // Login
  // -------------------------

  const login = async (formData) => {
    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Register
  // -------------------------

  const register = async (formData) => {
    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/register",
        formData
      );

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Logout
  // -------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };
  // -------------------------
// Refresh Logged In User
// -------------------------

const refreshUser = async () => {
  try {
    const { data } = await api.get("/api/v1/auth/me");

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to refresh user",
    };
  }
};
  return (
   <AuthContext.Provider
  value={{
    user,
    token,
    loading,

    login,
    register,
    logout,
    refreshUser,

    isAuthenticated: !!token,

    role: user?.role,
  }}
 >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
