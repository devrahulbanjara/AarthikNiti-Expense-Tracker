"use client";

import { Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AppHeader = ({
  title,
  subtitle,
  darkMode,
  toggleDarkMode,
  handleLogout,
  scrolled,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileDropdown &&
        !event.target.closest(".profile-dropdown-container")
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 ${
        darkMode ? "bg-gray-900" : "bg-white"
      } z-30 p-6 transition-all duration-300 ${
        scrolled
          ? `${
              darkMode ? "bg-opacity-80" : "bg-opacity-90"
            } backdrop-blur-sm border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`
          : "bg-opacity-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {subtitle}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            } cursor-pointer`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          <div className="relative profile-dropdown-container">
            <button
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
              }`}
              onClick={() => setShowProfileDropdown((prev) => !prev)}
            >
              <User
                className={`h-5 w-5 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>

            {showProfileDropdown && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md border py-1 z-10 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >
                <Link
                  to="/profile"
                  className={`flex items-center px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User
                    className={`h-4 w-4 mr-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className={`flex items-center px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings
                    className={`h-4 w-4 mr-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  Settings
                </Link>
                <div
                  className={`border-t ${
                    darkMode ? "border-gray-700" : "border-gray-100"
                  } my-1`}
                />
                <button
                  className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`mt-2 h-1 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
      ></div>
    </div>
  );
};

export default AppHeader;
