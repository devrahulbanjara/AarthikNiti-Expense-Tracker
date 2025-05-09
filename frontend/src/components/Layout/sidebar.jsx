"use client";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Settings,
  Plus,
  X,
  BarChart2,
} from "lucide-react";
import AddAccountModal from "./AddAccountModal";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart2, href: "/reports" },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [activeAccount, setActiveAccount] = useState("Personal");
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);

  const fetchProfiles = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/get_profile_names`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profiles");
      const data = await response.json();
      setAccounts(data.profiles);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  const fetchActiveProfile = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/active_profile_info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch active profile");
      const data = await response.json();
      setActiveAccount(data.profile_name);
    } catch (err) {
      console.error("Error fetching active profile:", err);
    }
  };

  const switchProfile = async (profileId, profileName) => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/switch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (!response.ok) throw new Error("Failed to switch profile");

      setActiveAccount(profileName);
      setShowAccountDropdown(false);
      toast.success(`Switched to ${profileName} successfully!`);
      navigate("/");
    } catch (err) {
      console.error("Error switching profile:", err);
      toast.error("Failed to switch profile!");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchActiveProfile();
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
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/create`, {
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

      const newAccount = await response.json();
      setAccounts([...accounts, newAccount]);
      setShowAddAccountModal(false);
      setError("");

      await switchProfile(newAccount.profile_id, newAccount.profile_name);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigation = (href) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 ${
          darkMode ? "bg-gray-800" : "bg-[#065336]"
        } transition-colors duration-300 ease-in-out z-40 md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div
            className={`flex justify-between items-center mb-4 md:block ${
              isMobileMenuOpen ? "ml-12" : ""
            }`}
          >
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-white"
              }`}
            >
              AarthikNiti
            </h2>
          </div>

          <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-400"}`} />

          {/* Account Dropdown */}
          <div className="mb-4 relative account-dropdown-container">
            <div
              className={`flex justify-between items-center p-2 border ${
                darkMode ? "border-gray-700" : "border-gray-400/50"
              } rounded-md cursor-pointer ${
                darkMode
                  ? "text-gray-100 hover:bg-gray-700"
                  : "text-white hover:bg-[#054328]"
              } transition-colors`}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {showAccountDropdown && (
              <div
                className={`absolute left-0 right-0 mt-1 ${
                  darkMode ? "bg-gray-800" : "bg-[#065336]"
                } border ${
                  darkMode ? "border-gray-700" : "border-gray-400"
                } rounded-md shadow-md z-10`}
              >
                {accounts.map((account) => (
                  <div
                    key={account.profile_id}
                    className={`p-2 ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-[#054328] text-white"
                    } cursor-pointer transition-colors`}
                    onClick={() => {
                      switchProfile(account.profile_id, account.profile_name);
                      setShowAccountDropdown(false);
                    }}
                  >
                    <div className="font-medium">{account.profile_name}</div>
                  </div>
                ))}
                <div
                  className={`p-2 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-400"
                  } ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-100"
                      : "hover:bg-[#054328] text-white"
                  } cursor-pointer flex items-center transition-colors`}
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

          <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-400"}`} />

          {/* Navigation */}
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center py-2 px-4 rounded-md mb-1 cursor-pointer ${
                      isActive
                        ? darkMode
                          ? "bg-gray-700 text-gray-100"
                          : "bg-[#054328] text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-white hover:bg-[#054328]"
                    } transition-all`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Bottom Settings */}
          <div className="mt-auto mb-6">
            <hr
              className={`my-3 ${
                darkMode ? "border-gray-700" : "border-gray-400"
              }`}
            />
            <ul>
              <li>
                <button
                  onClick={() => handleNavigation("/settings")}
                  className={`w-full flex items-center py-2 px-4 rounded-md mb-1 cursor-pointer ${
                    location.pathname === "/settings"
                      ? darkMode
                        ? "bg-gray-700 text-gray-100"
                        : "bg-[#054328] text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-white hover:bg-[#054328]"
                  } transition-all`}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Profile Modal */}
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

      <ToastContainer />
    </>
  );
};

export default Sidebar;
