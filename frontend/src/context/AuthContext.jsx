import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOKEN_KEY = "access_token";
const TOKEN_TIMESTAMP_KEY = "token_timestamp";
const REMEMBER_ME_KEY = "remember_me";
const USER_DATA_KEY = "user_data";
const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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

  const updateUserData = async () => {
    try {
      const userData = await loadUserData(true); // Force reload from API
      return userData;
    } catch (error) {
      console.error("Error updating user data:", error);
      return null;
    }
  };

  const loadUserData = async (forceReload = false) => {
    try {
      const token = getToken();
      if (!token) return null;

      // First check if we have cached user data and we're not forcing a reload
      const storage = getStorage();
      const cachedUserData = storage.getItem(USER_DATA_KEY);

      if (cachedUserData && !forceReload) {
        const userData = JSON.parse(cachedUserData);
        setUser(userData);
        return userData;
      }

      // If no cached data or we're forcing a reload, fetch from API
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user data");

      const userData = await response.json();
      setUser(userData);
      storage.setItem(USER_DATA_KEY, JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  };

  const login = (token, rememberMe = false) => {
    const currentTime = new Date().getTime();
    const storage = rememberMe ? localStorage : sessionStorage;

    // Clear any existing tokens from both storages
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);

    // Store remember me preference in localStorage
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());

    // Store token and timestamp in appropriate storage
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(TOKEN_TIMESTAMP_KEY, currentTime.toString());

    setIsAuthenticated(true);

    // Load user data after successful login
    loadUserData();
  };

  const logout = () => {
    // Clear both storages
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_TIMESTAMP_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);

    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    // Check token expiration on app initialization
    const isValid = checkTokenExpiration();
    setIsAuthenticated(isValid);

    // If token is valid, load user data
    if (isValid) {
      loadUserData();
    }

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        getToken,
        user,
        loadUserData,
        updateUserData,
      }}
    >
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
