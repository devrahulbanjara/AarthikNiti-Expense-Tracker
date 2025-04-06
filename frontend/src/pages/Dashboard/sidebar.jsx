"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, ArrowUp, ArrowDown, BarChart, Bell, User, ChevronDown, Settings, Plus } from "lucide-react"
import AddAccountModal from "./AddAccountModal"

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: Bell, href: "/budgeting" },
]

const accounts = [
  { name: "Personal", id: "personal", email: "john@example.com" },
  { name: "Business", id: "business", email: "john@company.com" },
  { name: "Travel", id: "travel", email: "john@travel.com" },
]

const Sidebar = ({ darkMode }) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [activeAccount, setActiveAccount] = useState("Personal")
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const location = useLocation() // Get the current route

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

  const handleAddAccount = (accountData) => {
    // Here you would typically send this data to your backend
    console.log("Adding new account:", accountData)
    // Close the modal
    setShowAddAccountModal(false)
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-1/5 h-full bg-[#065336] text-white p-4 border-r border-[#054328] min-h-screen z-30 transition-colors duration-300 flex flex-col`}
      >
        <div className="opacity-100 transition-opacity duration-300">
          <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>

          <hr className="my-3 border-[#0a6e47]" />

          {/* Accounts Section */}
          <div className="mb-4 relative account-dropdown-container">
            <div
              className="flex justify-between items-center p-2 border rounded-md cursor-pointer hover:bg-[#0a6e47] border-[#0a6e47]"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {showAccountDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-[#065336] border-[#0a6e47] border rounded-md shadow-md z-10">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-2 hover:bg-[#0a6e47] cursor-pointer"
                    onClick={() => {
                      setActiveAccount(account.name)
                      setShowAccountDropdown(false)
                    }}
                  >
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-300">{account.email}</div>
                  </div>
                ))}
                <div
                  className="p-2 border-t border-[#0a6e47] hover:bg-[#0a6e47] cursor-pointer text-white flex items-center"
                  onClick={() => {
                    setShowAccountDropdown(false)
                    setShowAddAccountModal(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Account
                </div>
              </div>
            )}
          </div>

          <hr className="my-3 border-[#0a6e47]" />

          {/* Navigation Items */}
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                      isActive ? "bg-[#0a6e47] text-white" : "hover:bg-[#0a6e47] text-gray-200"
                    } cursor-pointer transition-all`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 ${isActive ? "text-white" : "text-gray-200"}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Profile & Settings Section */}
        <div className="mt-auto mb-6">
          <hr className="my-3 border-[#0a6e47]" />
          <ul>
            {[
              { name: "Profile", icon: User, href: "/profile" },
              { name: "Settings", icon: Settings, href: "/settings" },
            ].map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                      isActive ? "bg-[#0a6e47] text-white" : "hover:bg-[#0a6e47] text-gray-200"
                    } cursor-pointer transition-all`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 ${isActive ? "text-white" : "text-gray-200"}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onAddAccount={handleAddAccount}
      />
    </>
  )
}

export default Sidebar

