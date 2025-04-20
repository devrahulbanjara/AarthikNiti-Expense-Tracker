import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "./sidebar";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if the current route is an auth route
  const isAuthRoute =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgotpw";

  return (
    <div className="flex h-screen">
      {!isAuthRoute && isAuthenticated && (
        <>
          <Sidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-4 left-4 z-50 p-2 rounded-full bg-[#065336] text-white md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </>
      )}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
