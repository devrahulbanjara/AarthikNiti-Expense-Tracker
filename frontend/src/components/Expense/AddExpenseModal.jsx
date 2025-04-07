"use client"

import { expenseCategories } from "../../pages/Dashboard/expenseCategories"
import { X } from "lucide-react"

const AddExpenseModal = ({ darkMode, showAddModal, setShowAddModal, newExpense, setNewExpense, handleAddExpense }) => {
  if (!showAddModal) return null

  const handleChange = (field) => (e) => {
    setNewExpense({ ...newExpense, [field]: e.target.value })
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white bg-opacity-95" : "bg-white text-gray-800 bg-opacity-95"
        } rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} p-2 rounded-full transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddExpense()
          }}
          className="p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category*</label>
              <select
                value={newExpense.category}
                onChange={handleChange("category")}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                required
              >
                <option value="">Select category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount*</label>
              <div className="relative">
                <span className="absolute left-3 top-3">$</span>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={handleChange("amount")}
                  placeholder="0.00"
                  className={`w-full pl-8 p-3 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date*</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={handleChange("date")}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method*</label>
              <select
                value={newExpense.paymentMethod}
                onChange={handleChange("paymentMethod")}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                required
              >
                <option value="">Select method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Payment">Mobile Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={handleChange("description")}
                placeholder="Brief description"
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={newExpense.isRecurring}
                onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                className="h-4 w-4 text-[#065336] focus:ring-[#065336] border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm">
                Recurring Expense
              </label>
            </div>

            {newExpense.isRecurring && (
              <div>
                <label className="block text-sm font-medium mb-1">Recurring Period</label>
                <select
                  value={newExpense.recurringPeriod}
                  onChange={handleChange("recurringPeriod")}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                >
                  <option value="1 day">Daily</option>
                  <option value="1 week">Weekly</option>
                  <option value="1 month">Monthly</option>
                  <option value="2 months">Every 2 Months</option>
                  <option value="3 months">Every 3 Months</option>
                  <option value="6 months">Every 6 Months</option>
                  <option value="1 year">Yearly</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className={`px-4 py-2 rounded-lg ${
                darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#065336] hover:bg-[#054328] text-white rounded-lg transition-colors"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseModal;