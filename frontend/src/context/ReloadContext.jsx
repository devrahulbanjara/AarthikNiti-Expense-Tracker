import React, { createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ReloadContext = createContext();
const RELOAD_FLAG_KEY = 'reload_detection_flag';
const PAGE_LOAD_TIME_KEY = 'page_load_time';
const PAGE_ID_KEY = 'current_page_id';

export const ReloadProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Skip this effect if we're already on the home page
    if (location.pathname === "/") {
      // Clear any stored reload flags when on the home page
      sessionStorage.removeItem(RELOAD_FLAG_KEY);
      sessionStorage.removeItem(PAGE_LOAD_TIME_KEY);
      sessionStorage.removeItem(PAGE_ID_KEY);
      return;
    }
    
    // Generate a unique page ID for this navigation
    const generatePageId = () => {
      return Math.random().toString(36).substring(2, 15);
    };
    
    // Function to check if the page is being reloaded
    const isPageReload = () => {
      // Method 1: Check performance navigation type (older browsers)
      if (window.performance && window.performance.navigation) {
        if (window.performance.navigation.type === 1) {
          return true;
        }
      }
      
      // Method 2: Check navigation entry type (newer browsers)
      if (window.performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
          return true;
        }
      }
      
      // Method 3: Page ID check
      // If the page ID exists and it's the same as the one we set, 
      // this is likely a reload rather than a navigation
      const storedPageId = sessionStorage.getItem(PAGE_ID_KEY);
      const currentPath = location.pathname;
      
      // Check if we have a stored reload flag specifically for this path
      const reloadFlag = sessionStorage.getItem(RELOAD_FLAG_KEY);
      if (reloadFlag === currentPath) {
        return true;
      }
      
      // If we get here, set the page ID and reload flag for future checks
      const newPageId = generatePageId();
      sessionStorage.setItem(PAGE_ID_KEY, newPageId);
      sessionStorage.setItem(RELOAD_FLAG_KEY, currentPath);
      
      return false;
    };
    
    // Check if this is a page reload
    if (isPageReload()) {
      console.log("Reload detected on:", location.pathname);
      
      // If it's a reload, navigate to home page
      const url = window.location.origin;
      // Clear flags before redirecting
      sessionStorage.removeItem(RELOAD_FLAG_KEY);
      sessionStorage.removeItem(PAGE_LOAD_TIME_KEY);
      sessionStorage.removeItem(PAGE_ID_KEY);
      
      // Use hard redirect
      window.location.href = url;
    }
    
    // Cleanup function
    return () => {
      // nothing specific to clean up
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