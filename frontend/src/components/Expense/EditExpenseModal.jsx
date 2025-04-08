"use client"

import { expenseCategories } from "../../pages/Dashboard/expenseCategories"
import { useTheme } from "../../context/ThemeContext"

const EditExpenseModal = ({
  showEditModal,
  setShowEditModal,
  currentExpense,
  setCurrentExpense,
  handleEditExpense,
}) => {
  const { darkMode } = useTheme()

  if (!showEditModal || !currentExpense) return null

  const handleChange = (field, value) => {
    setCurrentExpense({ ...currentExpense, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <button
          onClick={() => {
            setShowEditModal(false)
            setCurrentExpense(null)
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Category*</label>
            <select
              value={currentExpense.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              required
            >
              <option value="">Select Category</option>
              {expenseCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Amount*</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <input
                type="number"
                value={currentExpense.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                className={`w-full pl-8 p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-white border-gray-300 text-black"}`}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Date*</label>
            <input
              type="date"
              value={currentExpense.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
              Payment Method*
            </label>
            <select
              value={currentExpense.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              required
            >
              <option value="">Select Method</option>
              {["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Mobile Payment"].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Description</label>
          <input
            type="text"
            value={currentExpense.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter description"
            className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-white border-gray-300 text-black"}`}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editIsRecurring"
              checked={currentExpense.isRecurring}
              onChange={(e) => handleChange("isRecurring", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="editIsRecurring" className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Recurring Expense
            </label>
          </div>

          {currentExpense.isRecurring && (
            <div className="mt-2">
              <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                Recurring Period
              </label>
              <select
                value={currentExpense.recurringPeriod}
                onChange={(e) => handleChange("recurringPeriod", e.target.value)}
                className={`w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              >
                {["1 day", "1 week", "1 month", "2 months", "3 months", "6 months", "1 year"].map((period) => (
                  <option key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowEditModal(false)
              setCurrentExpense(null)
            }}
            className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
          >
            Cancel
          </button>
          <button onClick={handleEditExpense} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditExpenseModal;