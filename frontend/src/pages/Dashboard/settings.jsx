"use client"

import { useState } from "react"
import { SettingsIcon, User, Bell, Lock, Globe, Moon, Sun } from "lucide-react"

const Settings = ({ darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Globe },
  ]

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"}`}
    >
      <div className="flex items-center mb-6">
        <SettingsIcon className={`h-6 w-6 mr-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="md:w-1/4">
          <ul className={`space-y-1 border rounded-md ${darkMode ? "border-gray-700" : "border-gray-200"} p-2`}>
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-2 rounded-md ${
                    activeTab === tab.id
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-900"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="md:w-3/4">
          {activeTab === "general" && (
            <div>
              <h3 className="text-lg font-medium mb-4">General Settings</h3>
              <div className={`space-y-4 p-4 border rounded-md ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Display Name</label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    defaultValue="John Doe"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                  <input
                    type="email"
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Language</label>
                  <select
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance Settings</h3>
              <div className={`space-y-4 p-4 border rounded-md ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                    <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 rounded-full relative ${
                      darkMode ? "bg-blue-500" : "bg-gray-300"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all duration-300 ${
                        darkMode ? "left-6" : "left-0.5"
                      }`}
                    ></span>
                  </button>
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Theme Color</label>
                  <div className="flex space-x-2">
                    {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
              <div className={`space-y-4 p-4 border rounded-md ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <button
                    className={`w-12 h-6 rounded-full relative ${
                      darkMode ? "bg-blue-500" : "bg-gray-300"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`absolute w-5 h-5 rounded-full bg-white top-0.5 left-6 transition-all duration-300`}
                    ></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Push Notifications</span>
                  <button
                    className={`w-12 h-6 rounded-full relative ${
                      darkMode ? "bg-blue-500" : "bg-gray-300"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`absolute w-5 h-5 rounded-full bg-white top-0.5 left-6 transition-all duration-300`}
                    ></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Budget Alerts</span>
                  <button
                    className={`w-12 h-6 rounded-full relative ${
                      darkMode ? "bg-blue-500" : "bg-gray-300"
                    } transition-colors duration-300`}
                  >
                    <span
                      className={`absolute w-5 h-5 rounded-full bg-white top-0.5 left-6 transition-all duration-300`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Security Settings</h3>
              <div className={`space-y-4 p-4 border rounded-md ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>New Password</label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full p-2 border rounded-md ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-2">
                  <button
                    className={`px-4 py-2 ${
                      darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded-md`}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

