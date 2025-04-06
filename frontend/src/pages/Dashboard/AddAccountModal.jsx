"use client"

import { useState } from "react"
import { X } from "lucide-react"

const AddAccountModal = ({ isOpen, onClose, onAddAccount }) => {
  const [newAccountData, setNewAccountData] = useState({ name: "", email: "" })

  if (!isOpen) return null

  const handleSubmit = () => {
    onAddAccount(newAccountData)
    setNewAccountData({ name: "", email: "" })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent">
      <div className="bg-white bg-opacity-95 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Account</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">Create a new account to track different financial aspects.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newAccountData.name}
                onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                placeholder="Personal, Business, etc."
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#065336] focus:border-[#065336]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newAccountData.email}
                onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#065336] focus:border-[#065336]"
              />
            </div>
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

