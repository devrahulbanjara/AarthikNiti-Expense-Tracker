"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const AddAccountModal = ({ isOpen, onClose, onAddAccount, darkMode, error }) => {
  const [newAccountData, setNewAccountData] = useState({ name: "", email: "" })

  useEffect(() => {
    if (!isOpen) {
      setNewAccountData({ name: "", email: "" })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    onAddAccount(newAccountData)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent">
      <div
        className={`${
          darkMode ? "bg-gray-800 bg-opacity-95 text-gray-100" : "bg-white bg-opacity-95 text-gray-800"
        } rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden transition-colors duration-300`}
      >
        <div
          className={`flex justify-between items-center p-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">Add New Account</h2>
          <button
            onClick={onClose}
            className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} p-2 rounded-full transition-colors`}
          >
            <X className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          </button>
        </div>

        <div className="p-6">
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
            Create a new account to track different financial aspects.
          </p>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Name
              </label>
              <input
                type="text"
                value={newAccountData.name}
                onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                placeholder="Personal, Business, etc."
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    : "bg-white border-gray-300 focus:ring-2 focus:ring-[#065336] focus:border-[#065336]"
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Email
              </label>
              <input
                type="email"
                value={newAccountData.email}
                onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                placeholder="email@example.com"
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    : "bg-white border-gray-300 focus:ring-2 focus:ring-[#065336] focus:border-[#065336]"
                }`}
              />
            </div>

            {/* Error message block */}
            {error && (
              <div className={`text-sm mt-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#065336] hover:bg-[#054328] text-white rounded-lg transition-colors"
            >
              Add Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAccountModal
