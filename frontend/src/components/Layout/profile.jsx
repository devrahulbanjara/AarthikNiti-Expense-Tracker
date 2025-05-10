"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Profile = ({ handleLogout }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const hasProfilePicture =
    user &&
    typeof user.profile_picture === "string" &&
    user.profile_picture.trim() !== "";

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
    <div className="relative profile-dropdown-container z-40">
      <button
        className={`overflow-hidden flex items-center justify-center ${
          hasProfilePicture ? "p-0" : "p-2"
        } ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-200 hover:bg-gray-300"
        } rounded-full transition-colors w-9 h-9`}
        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        aria-label="Profile menu"
      >
        {hasProfilePicture ? (
          <img
            src={user.profile_picture}
            alt="Profile Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <User
            className={`h-5 w-5 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
        )}
      </button>

      {/* profile dropdown menu */}
      {showProfileDropdown && (
        <div
          className={`absolute right-0 mt-2 w-48 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-lg border shadow-lg py-1 z-50`}
        >
          <Link
            to="/profile"
            className={`flex items-center px-4 py-2 text-sm ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            } transition-colors`}
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
            } transition-colors`}
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
              darkMode ? "border-gray-700" : "border-gray-200"
            } my-1`}
          ></div>
          <button
            className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
