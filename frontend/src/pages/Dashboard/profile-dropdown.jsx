import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

const ProfileDropdown = ({ darkMode, handleLogout }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown-container")) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const dropdownClasses = `absolute right-0 mt-2 w-48 rounded-md border py-1 z-10 ${
    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
  }`;

  const linkClasses = `flex items-center px-4 py-2 text-sm ${
    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
  }`;

  return (
    <div className="relative profile-dropdown-container">
      <button
        className={`p-2 rounded-full ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"}`}
        onClick={() => setShowProfileDropdown((prev) => !prev)}
      >
        <User  className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
      </button>

      {showProfileDropdown && (
        <div className={dropdownClasses}>
          <Link to="/profile" className={linkClasses}>
            <User  className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            Profile
          </Link>
          <Link to="/settings" className={linkClasses}>
            <Settings className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            Settings
          </Link>
          <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"} my-1`} />
          <button
            className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
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

export default ProfileDropdown;