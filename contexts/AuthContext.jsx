"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/api";

// Create auth context
const AuthContext = createContext();

// Add this function near the top of your file, outside the AuthProvider component
const isAdminUser = (userData) => {
  
  return (
    userData && 
    (userData.isAdmin === true || 
     userData.type === "admin" || 
     userData.role === "admin" ||
     userData.phone === "8899889988") // Temporarily add this phone number as admin
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      
      // Save authentication data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.userId,
        email: response.createdUser.email,
        phone: response.createdUser.phone,
        isAdmin: response.createdUser.isAdmin,
        referralCode: response.referralCode
      }));
      
      setToken(response.token);
      setUser({
        id: response.userId,
        email: response.createdUser.email,
        phone: response.createdUser.phone,
        isAdmin: response.createdUser.isAdmin,
        referralCode: response.referralCode
      });
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response); // Log the full response
      
      const { token, user } = response;
      
      // Check and assign admin status
      const adminStatus = isAdminUser(user);
      console.log("Admin status detected:", adminStatus);
      
      // Store admin status explicitly in the user object
      const enhancedUser = {
        ...user,
        isAdmin: adminStatus
      };
      
      setToken(token);
      setUser(enhancedUser);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(enhancedUser));
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Reset password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: isAdminUser(user), // Explicitly check here too
        token,
        loading,
        error,
        isAuthenticated: !!token,
        register,
        login,
        logout,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
