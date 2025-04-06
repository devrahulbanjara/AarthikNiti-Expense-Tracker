"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, ArrowUp, ArrowDown, BarChart, Bell, User, ChevronDown, Settings, Plus, X } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expense", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: Bell, href: "/budgeting" },
]

const defaultAccounts = [
  { name: "Personal", id: "personal" },
  { name: "Business", id: "business" },
  { name: "Travel", id: "travel" },
]

const Sidebar = ({ darkMode }) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [activeAccount, setActiveAccount] = useState("Personal")
  const [accounts, setAccounts] = useState(defaultAccounts)
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [newAccountName, setNewAccountName] = useState("")

  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAccountDropdown && !event.target.closest(".account-dropdown-container")) {
        setShowAccountDropdown(false)
        setIsAddingAccount(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showAccountDropdown])

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      const newAccount = {
        name: newAccountName.trim(),
        id: newAccountName.toLowerCase().replace(/\s+/g, "-"),
      }
      setAccounts([...accounts, newAccount])
      setActiveAccount(newAccountName.trim())
      setNewAccountName("")
      setIsAddingAccount(false)
      setShowAccountDropdown(false)

      // api call yeta 
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-1/6 h-full ${darkMode ? "bg-gray-900" : "bg-white"} p-3 border-r ${darkMode ? "border-gray-700" : "border-gray-200"} min-h-screen z-30 transition-colors duration-300 flex flex-col md:w-1/6 sm:w-1/4 xs:w-1/3`}
    >
      <h2 className="text-xl font-bold mb-2">AarthikNiti</h2>
      <hr className={`my-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

      {/* Account Dropdown */}
      <div className="mb-2 relative account-dropdown-container">
        <div
          className={`flex justify-between items-center p-2 border rounded-md cursor-pointer ${darkMode ? "hover:bg-gray-800 border-gray-700" : "hover:bg-gray-50 border-gray-300"}`}
          onClick={() => setShowAccountDropdown((prev) => !prev)}
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

            {isAddingAccount ? (
              <div className={`p-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Account name"
                  className={`w-full p-1 mb-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
                  autoFocus
                />
                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAddingAccount(false)
                    }}
                    className={`px-2 py-1 rounded-md text-xs ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddAccount()
                    }}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`p-2 border-t ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} cursor-pointer text-blue-500`}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsAddingAccount(true)
                }}
              >
                + Add Account
              </div>
            )}
          </div>
        )}
      </div>

      <hr className={`my-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

      {/* Navigation Links */}
      <ul>
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.href}
              className={`flex items-center py-2 px-3 rounded-md mb-1 ${
                location.pathname === item.href ? (darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black") : ""
              } ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
            >
              <item.icon className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto mb-4">
        <hr className={`my-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
        <ul>
          <li>
            <Link
              to="/profile"
              className={`flex items-center py-2 px-3 rounded-md ${location.pathname === "/profile" ? (darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black") : ""} ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
            >
              <User className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center py-2 px-3 rounded-md ${location.pathname === "/settings" ? (darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black") : ""} ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
            >
              <Settings className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;