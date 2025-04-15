import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "access_token";
const TOKEN_TIMESTAMP_KEY = "token_timestamp";
const REMEMBER_ME_KEY = "remember_me";
const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getStorage = () => {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";
    return rememberMe ? localStorage : sessionStorage;
  };

  const getToken = () => {
    const storage = getStorage();
    return storage.getItem(TOKEN_KEY);
  };

  const checkTokenExpiration = () => {
    const storage = getStorage();
    const token = storage.getItem(TOKEN_KEY);
    const timestamp = storage.getItem(TOKEN_TIMESTAMP_KEY);
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";

    if (!token || !timestamp) {
      return false;
    }

    const currentTime = new Date().getTime();
    const tokenTime = parseInt(timestamp);
    const timeElapsed = currentTime - tokenTime;

    if (timeElapsed > TOKEN_EXPIRY_TIME) {
      logout();
      return false;
    }

    return true;
  };

  const login = (token, rememberMe = false) => {
    const currentTime = new Date().getTime();
    const storage = rememberMe ? localStorage : sessionStorage;

    // Clear any existing tokens from both storages
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);

    // Store remember me preference in localStorage
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

    // Store token and timestamp in appropriate storage
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(TOKEN_TIMESTAMP_KEY, currentTime.toString());

    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear both storages
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);

    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    // Check token expiration on app initialization
    const isValid = checkTokenExpiration();
    setIsAuthenticated(isValid);

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>
      {children}
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
