import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import CompactCurrencyDropdown from "./CompactCurrencyDropdown";
import Profile from "./profile";

const Header = ({ title, subtitle }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
        <div className="md:ml-0 ml-12 mt-1 md:mt-2">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-medium font-poppins ml-[-5px]">
              {title}
            </h1>
            <div className="fixed top-4 right-4 flex items-center space-x-3 md:hidden">
              <CompactCurrencyDropdown />
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun size={20} className="text-amber-300" />
                ) : (
                  <Moon size={20} className="text-indigo-600" />
                )}
              </button>
              <Profile handleLogout={handleLogout} />
            </div>
          </div>
          <p
            className={`text-sm md:text-base ml-[-5px] mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="hidden md:flex fixed top-6 right-6 items-center space-x-3">
          <CompactCurrencyDropdown />
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={20} className="text-amber-300" />
            ) : (
              <Moon size={20} className="text-indigo-600" />
            )}
          </button>
          <Profile handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;