"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ArrowUp,
  ArrowDown,
  User,
  ChevronDown,
  Settings,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import AddAccountModal from "./AddAccountModal";
import { useTheme } from "../../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
];

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [activeAccount, setActiveAccount] = useState("Personal");
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);
  const location = useLocation();

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://127.0.0.1:8000/profile/get_profile_names",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data = await response.json();
      setAccounts(data.profiles); // Ensure profiles are correctly set
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  const fetchActiveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://127.0.0.1:8000/profile/active_profile_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active profile");
      }

      const data = await response.json();
      setActiveAccount(data.profile_name); // Set the active profile based on the backend
    } catch (err) {
      console.error("Error fetching active profile:", err);
    }
  };

  const switchProfile = async (profileId, profileName) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/profile/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch profile");
      }

      setActiveAccount(profileName);
      setShowAccountDropdown(false);

      // Delay the reload to ensure the toast appears
      setTimeout(() => {
        window.location.reload(); // This will reload the page after the toast is shown
      }, 500); // Delay of 500ms

      // Show success toast
      toast.success(`Switched to ${profileName} successfully!`);
    } catch (err) {
      console.error("Error switching profile:", err);
      toast.error("Failed to switch profile!"); // Show error toast in case of failure
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchActiveProfile(); // Fetch the active profile when the component loads
  }, []);

  const handleAddAccount = async ({ name }) => {
    if (!name) {
      setError("Account name is required.");
      return;
    }

    const isDuplicateName = accounts.some(
      (acc) => acc.profile_name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicateName) {
      setError("An account with this name already exists.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/profile/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_name: name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create profile");
      }

      const newAccount = await response.json(); // Assuming the API returns the created profile
      setAccounts([...accounts, newAccount]);

      // Now switch to the new profile and set it as active both on frontend and backend
      await switchProfile(newAccount.profile_id, newAccount.profile_name);

      // Show success toast
      toast.success(`Switched to ${newAccount.profile_name} successfully!`);

      setShowAddAccountModal(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-1/6 h-full ${
          darkMode ? "bg-[#0f172a] text-gray-100" : "bg-[#065336] text-white"
        } p-4 border-r ${
          darkMode ? "border-[#1e293b]" : "border-[#054328]"
        } min-h-screen z-30 transition-colors duration-300 flex flex-col`}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>
          <hr
            className={`my-3 ${
              darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"
            }`}
          />

          {/* Account Dropdown */}
          <div className="mb-4 relative account-dropdown-container">
            <div
              className={`flex justify-between items-center p-2 border rounded-md cursor-pointer ${
                darkMode
                  ? "hover:bg-[#1e293b] border-[#1e293b]"
                  : "hover:bg-[#0a6e47] border-[#0a6e47]"
              }`}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {showAccountDropdown && (
              <div
                className={`absolute left-0 right-0 mt-1 ${
                  darkMode
                    ? "bg-[#0f172a] border-[#1e293b]"
                    : "bg-[#065336] border-[#0a6e47]"
                } border rounded-md shadow-md z-10`}
              >
                {accounts.map((account) => (
                  <div
                    key={account.profile_id}
                    className={`p-2 ${
                      darkMode ? "hover:bg-[#1e293b]" : "hover:bg-[#0a6e47]"
                    } cursor-pointer`}
                    onClick={() =>
                      switchProfile(account.profile_id, account.profile_name)
                    }
                  >
                    <div className="font-medium">{account.profile_name}</div>
                  </div>
                ))}
                <div
                  className={`p-2 border-t ${
                    darkMode
                      ? "border-[#1e293b] hover:bg-[#1e293b]"
                      : "border-[#0a6e47] hover:bg-[#0a6e47]"
                  } cursor-pointer flex items-center`}
                  onClick={() => {
                    setShowAccountDropdown(false);
                    setShowAddAccountModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Profile
                </div>
              </div>
            )}
          </div>

          <hr
            className={`my-3 ${
              darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"
            }`}
          />

          {/* Nav Items */}
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                      isActive
                        ? darkMode
                          ? "bg-[#1e293b] text-white"
                          : "bg-[#0a6e47] text-white"
                        : darkMode
                        ? "hover:bg-[#1e293b] text-gray-300"
                        : "hover:bg-[#0a6e47] text-gray-200"
                    } transition-all`}
                  >
                    <item.icon
                      className={`mr-2 h-4 w-4 ${
                        isActive
                          ? "text-white"
                          : darkMode
                          ? "text-gray-300"
                          : "text-gray-200"
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Profile & Settings */}
        <div className="mt-auto mb-6">
          <hr
            className={`my-3 ${
              darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"
            }`}
          />
          <ul>
            {[
              { name: "Profile", icon: User, href: "/profile" },
              { name: "Settings", icon: Settings, href: "/settings" },
            ].map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                      isActive
                        ? darkMode
                          ? "bg-[#1e293b] text-white"
                          : "bg-[#0a6e47] text-white"
                        : darkMode
                        ? "hover:bg-[#1e293b] text-gray-300"
                        : "hover:bg-[#0a6e47] text-gray-200"
                    } transition-all`}
                  >
                    <item.icon
                      className={`mr-2 h-4 w-4 ${
                        isActive
                          ? "text-white"
                          : darkMode
                          ? "text-gray-300"
                          : "text-gray-200"
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`flex items-center py-2 px-4 rounded-md mt-3 w-full ${
              darkMode
                ? "hover:bg-[#1e293b] text-gray-300"
                : "hover:bg-[#0a6e47] text-gray-200"
            } transition-all`}
          >
            {darkMode ? (
              <>
                <Sun className="mr-2 h-4 w-4" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => {
          setShowAddAccountModal(false);
          setError("");
        }}
        onAddAccount={handleAddAccount}
        darkMode={darkMode}
        error={error}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
};

export default Sidebar;
