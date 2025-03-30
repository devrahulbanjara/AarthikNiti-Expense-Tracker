"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, ArrowUp, ArrowDown, BarChart, Bell, User, ChevronDown, Settings } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: Bell, href: "/budgeting" },
]

const accounts = [
  { name: "Personal", id: "personal" },
  { name: "Business", id: "business" },
  { name: "Travel", id: "travel" },
]

const Sidebar = ({ darkMode }) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [activeAccount, setActiveAccount] = useState("Personal")

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAccountDropdown && !event.target.closest(".account-dropdown-container")) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAccountDropdown])

  return (
    <div
      className={`fixed top-0 left-0 w-1/5 h-full ${darkMode ? "bg-gray-900" : "bg-white"} p-4 border-r ${darkMode ? "border-gray-700" : "border-gray-200"} min-h-screen z-30 transition-colors duration-300 flex flex-col`}
    >
      <div className="opacity-100 transition-opacity duration-300">
        <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>

        <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

        {/* accounts personal and other with +add account */}
        <div className="mb-4 relative account-dropdown-container">
          <div
            className={`flex justify-between items-center p-2 border rounded-md cursor-pointer ${darkMode ? "hover:bg-gray-800 border-gray-700" : "hover:bg-gray-50 border-gray-300"}`}
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <span>{activeAccount}</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          {showAccountDropdown && (
            <div
              className={`absolute left-0 right-0 mt-1 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-md shadow-md z-10`}
            >
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}
                  onClick={() => {
                    setActiveAccount(account.name)
                    setShowAccountDropdown(false)
                  }}
                >
                  {account.name}
                </div>
              ))}
              <div
                className={`p-2 border-t ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} cursor-pointer text-blue-500`}
              >
                + Add Account
              </div>
            </div>
          )}
        </div>

        <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

        {/* navigation nav bars  */}
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                  item.name === "Dashboard"
                    ? darkMode
                      ? "bg-gray-800"
                      : "bg-gray-200"
                    : darkMode
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                } cursor-pointer`}
              >
                <item.icon className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto mb-6">
        <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
        <ul>
          <li>
            <Link
              to="/profile"
              className={`flex items-center py-2 px-4 rounded-md mb-1 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
            >
              <User className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center py-2 px-4 rounded-md mb-1 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
            >
              <Settings className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

