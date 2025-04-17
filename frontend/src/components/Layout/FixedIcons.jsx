import { Moon, Sun, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const FixedIcons = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileOption = () => {
    setShowProfileDropdown(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full ${
          darkMode ? "bg-gray-700" : "bg-[#065336]"
        } ${
          darkMode
            ? "text-gray-100 hover:bg-gray-600"
            : "text-white hover:bg-[#054328]"
        } transition-colors`}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleProfileClick}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-[#065336]"
          } ${
            darkMode
              ? "text-gray-100 hover:bg-gray-600"
              : "text-white hover:bg-[#054328]"
          } transition-colors flex items-center gap-2`}
        >
          <User className="h-5 w-5" />
          <ChevronDown className="h-4 w-4 hidden md:block" />
        </button>
        {showProfileDropdown && (
          <div
            className={`absolute right-0 mt-2 w-48 ${
              darkMode ? "bg-gray-800" : "bg-[#065336]"
            } rounded-lg shadow-lg py-2 border ${
              darkMode ? "border-gray-700" : "border-gray-400"
            }`}
          >
            <button
              onClick={handleProfileOption}
              className={`w-full px-4 py-2 text-left ${
                darkMode
                  ? "text-gray-100 hover:bg-gray-700"
                  : "text-white hover:bg-[#054328]"
              } transition-colors flex items-center gap-2`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-2 text-left ${
                darkMode
                  ? "text-gray-100 hover:bg-gray-700"
                  : "text-white hover:bg-[#054328]"
              } transition-colors flex items-center gap-2`}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedIcons;
