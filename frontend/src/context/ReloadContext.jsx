import React, { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ReloadContext = createContext();

export const ReloadProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // This effect will run when the component mounts (page load/reload)
    
    // Skip this effect if we're already on the home page
    if (location.pathname === "/") {
      return;
    }
    
    // Store a flag in sessionStorage to detect page reloads
    const isPageReload = !sessionStorage.getItem("app_initialized");
    sessionStorage.setItem("app_initialized", "true");
    
    // If this is a page reload and not on the home page, navigate to home
    if (isPageReload) {
      // Use setTimeout to ensure navigation happens after the component is mounted
      setTimeout(() => {
        navigate("/");
      }, 100);
    }
    
    // Add beforeunload event listener to reset the flag when the page is about to unload
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("app_initialized");
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, location.pathname]);
  
  return (
    <ReloadContext.Provider value={{}}>
      {children}
    </ReloadContext.Provider>
  );
};

export const useReload = () => {
  const context = useContext(ReloadContext);
  if (!context) {
    throw new Error("useReload must be used within a ReloadProvider");
  }
  return context;
}; 