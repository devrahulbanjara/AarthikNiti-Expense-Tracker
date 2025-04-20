import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title, subtitle }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 md:left-1/5 right-0 z-30 p-4 md:p-6 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } ${
        scrolled
          ? `${
              darkMode ? "bg-opacity-80" : "bg-opacity-90"
            } backdrop-blur-sm border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } shadow-sm`
          : "bg-opacity-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-poppins">{title}</h1>
          <p className={`text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {subtitle}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? "hover:bg-gray-700 text-gray-300" 
                : "hover:bg-gray-100 text-gray-700"
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun size={20} className="text-amber-300" />
            ) : (
              <Moon size={20} className="text-indigo-600" />
            )}
          </button>
          
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center space-x-2 p-2 rounded-full transition-colors ${
                darkMode 
                  ? "hover:bg-gray-700" 
                  : "hover:bg-gray-100"
              }`}
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <User size={16} className={darkMode ? "text-gray-300" : "text-gray-700"} />
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`} />
            </button>
            
            {showProfileMenu && (
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                } transform origin-top-right transition-all duration-200 animate-fadeIn`}
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    darkMode 
                      ? "hover:bg-gray-700 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    darkMode 
                      ? "hover:bg-gray-700 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
                <hr className={darkMode ? "border-gray-700 my-1" : "border-gray-200 my-1"} />
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    darkMode 
                      ? "hover:bg-gray-700 text-red-400" 
                      : "hover:bg-gray-100 text-red-600"
                  }`}
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 