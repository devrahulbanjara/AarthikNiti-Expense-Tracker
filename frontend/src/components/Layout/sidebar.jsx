"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowUp, ArrowDown, BarChart, Bell, User, ChevronDown, Settings, Plus, Moon, Sun } from "lucide-react";
import AddAccountModal from "./AddAccountModal";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" }
];

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [activeAccount, setActiveAccount] = useState("Personal");
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([
    { name: "Personal", id: "personal" },
    { name: "Business", id: "business" },
    { name: "Travel", id: "travel" },
  ]);

  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAccountDropdown && !event.target.closest(".account-dropdown-container")) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountDropdown]);

  const handleAddAccount = ({ name }) => {
    if (!name) {
      setError("Account name is required.");
      return;
    }

    const isDuplicateName = accounts.some((acc) => acc.name.toLowerCase() === name.toLowerCase());
    if (isDuplicateName) {
      setError("An account with this name already exists.");
      return;
    }

    const newAccount = {
      name,
      id: name.toLowerCase().replace(/\s+/g, "-"),
    };

    setAccounts([...accounts, newAccount]);
    setActiveAccount(name);
    setShowAddAccountModal(false);
    setError("");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-1/6 h-full ${
          darkMode ? "bg-[#0f172a] text-gray-100" : "bg-[#065336] text-white"
        } p-4 border-r ${darkMode ? "border-[#1e293b]" : "border-[#054328]"} min-h-screen z-30 transition-colors duration-300 flex flex-col`}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>
          <hr className={`my-3 ${darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"}`} />

          {/* Account Dropdown */}
          <div className="mb-4 relative account-dropdown-container">
            <div
              className={`flex justify-between items-center p-2 border rounded-md cursor-pointer ${
                darkMode ? "hover:bg-[#1e293b] border-[#1e293b]" : "hover:bg-[#0a6e47] border-[#0a6e47]"
              }`}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {showAccountDropdown && (
              <div
                className={`absolute left-0 right-0 mt-1 ${
                  darkMode ? "bg-[#0f172a] border-[#1e293b]" : "bg-[#065336] border-[#0a6e47]"
                } border rounded-md shadow-md z-10`}
              >
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-2 ${darkMode ? "hover:bg-[#1e293b]" : "hover:bg-[#0a6e47]"} cursor-pointer`}
                    onClick={() => {
                      setActiveAccount(account.name);
                      setShowAccountDropdown(false);
                    }}
                  >
                    <div className="font-medium">{account.name}</div>
                  </div>
                ))}
                <div
                  className={`p-2 border-t ${darkMode ? "border-[#1e293b] hover:bg-[#1e293b]" : "border-[#0a6e47] hover:bg-[#0a6e47]"} cursor-pointer flex items-center`}
                  onClick={() => {
                    setShowAccountDropdown(false);
                    setShowAddAccountModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Account
                </div>
              </div>
            )}
          </div>

          <hr className={`my-3 ${darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"}`} />

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
                      className={`mr-2 h-4 w-4 ${isActive ? "text-white" : darkMode ? "text-gray-300" : "text-gray-200"}`}
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
          <hr className={`my-3 ${darkMode ? "border-[#1e293b]" : "border-[#0a6e47]"}`} />
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
                      className={`mr-2 h-4 w-4 ${isActive ? "text-white" : darkMode ? "text-gray-300" : "text-gray-200"}`}
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
              darkMode ? "hover:bg-[#1e293b] text-gray-300" : "hover:bg-[#0a6e47] text-gray-200"
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
    </>
  );
};

export default Sidebar;