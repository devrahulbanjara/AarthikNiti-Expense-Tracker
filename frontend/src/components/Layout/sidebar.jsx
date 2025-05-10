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
      const response = await fetch(
        `${BACKEND_URL}/profile/active_profile_info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full md:w-64 w-[240px] ${
          darkMode ? "bg-gray-800" : "bg-[#065336]"
        } transition-all duration-500 ease-out z-40 md:translate-x-0 transform
        ${
          isMobileMenuOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.34, 1.25, 0.64, 1)",
        }}
      >
        <div
          className={`flex flex-col h-full p-3 md:p-4 overflow-y-auto transition-opacity duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
        >
          <div
            className={`flex justify-between items-center mb-3 md:mb-4 md:block ${
              isMobileMenuOpen ? "ml-10 mt-4 md:ml-0 md:mt-0" : ""
            }`}
          >
            <h2
              className={`text-base md:text-xl font-bold ${
                darkMode ? "text-gray-100" : "text-white"
              } transform transition-transform duration-500 ${
                isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-8 md:translate-x-0"
              }`}
            >
              AarthikNiti
            </h2>
          </div>

          <hr
            className={`my-2 md:my-3 ${
              darkMode ? "border-gray-700" : "border-gray-400"
            } transition-transform duration-500 ${
              isMobileMenuOpen ? "scale-x-100" : "scale-x-0 md:scale-x-100"
            } origin-left`}
          />

          {/* Account Dropdown */}
          <div className="mb-3 md:mb-4 relative account-dropdown-container">
            <div
              className={`flex justify-between items-center p-1.5 md:p-2 border ${
                darkMode ? "border-gray-700" : "border-gray-400/50"
              } rounded-md cursor-pointer ${
                darkMode
                  ? "text-gray-100 hover:bg-gray-700"
                  : "text-white hover:bg-[#054328]"
              } transition-all duration-500 text-sm md:text-base transform ${
                isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-12 md:translate-x-0"
              }`}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </div>

            {showAccountDropdown && (
              <div
                className={`absolute left-0 right-0 mt-1 ${
                  darkMode ? "bg-gray-800" : "bg-[#065336]"
                } border ${
                  darkMode ? "border-gray-700" : "border-gray-400"
                } rounded-md shadow-md z-10 text-sm md:text-base animate-slideIn`}
              >
                {accounts.map((account) => (
                  <div
                    key={account.profile_id}
                    className={`p-1.5 md:p-2 ${
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
                  className={`p-1.5 md:p-2 border-t ${
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
                  <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" /> Add
                  Profile
                </div>
              </div>
            )}
          </div>

          <hr
            className={`my-2 md:my-3 ${
              darkMode ? "border-gray-700" : "border-gray-400"
            } transition-transform duration-500 ${
              isMobileMenuOpen ? "scale-x-100" : "scale-x-0 md:scale-x-100"
            } origin-left`}
          />

          {/* Navigation */}
          <ul>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              const delay = 100 + index * 60;

              return (
                <li
                  key={item.name}
                  className={`transition-all duration-500 transform ${
                    isMobileMenuOpen
                      ? "translate-x-0"
                      : "-translate-x-16 md:translate-x-0"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${delay}ms` : "0ms",
                  }}
                >
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center py-1.5 md:py-2 px-3 md:px-4 rounded-md mb-1 cursor-pointer ${
                      isActive
                        ? darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-[#054328] text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-100 hover:bg-[#054328] hover:text-white"
                    } transition-colors text-sm md:text-base`}
                  >
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 mr-3" />
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
              } transition-transform duration-500 ${
                isMobileMenuOpen ? "scale-x-100" : "scale-x-0 md:scale-x-100"
              } origin-left`}
            />
            <ul>
              <li
                className={`transition-all duration-500 transform ${
                  isMobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-16 md:translate-x-0"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${100 + navItems.length * 60}ms`
                    : "0ms",
                }}
              >
                <button
                  onClick={() => handleNavigation("/settings")}
                  className={`w-full flex items-center py-1.5 md:py-2 px-3 md:px-4 rounded-md mb-1 cursor-pointer ${
                    location.pathname === "/settings"
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-[#054328] text-white"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-white hover:bg-[#054328] hover:text-white"
                  } transition-colors text-sm md:text-base`}
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5 mr-3" />
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
