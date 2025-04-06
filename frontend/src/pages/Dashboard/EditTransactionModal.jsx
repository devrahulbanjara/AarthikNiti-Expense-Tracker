"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const EditTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction = null,
  expenseCategories,
  darkMode,
}) => {
  const [transaction, setTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (editingTransaction) {
      setTransaction({
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        date: editingTransaction.date,
      })
    } else {
      setTransaction({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [editingTransaction, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const transactionToSubmit = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      type: transaction.type,
      amount: Number.parseFloat(transaction.amount),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
    }

    onSubmit(transactionToSubmit, !!editingTransaction)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-transparent">
      <div
        className={`relative ${darkMode ? "bg-gray-800 bg-opacity-95 text-white" : "bg-white bg-opacity-95 text-gray-800"} p-6 rounded-lg w-full max-w-md shadow-xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
          <button
            className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Type</label>
            <div className="flex rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-3 ${
                  transaction.type === "income"
                    ? "bg-[#065336] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                } cursor-pointer transition-colors`}
                onClick={() => setTransaction({ ...transaction, type: "income" })}
              >
                Income
              </button>
              <button
                type="button"
                className={`flex-1 py-3 ${
                  transaction.type === "expense"
                    ? "bg-[#065336] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                } cursor-pointer transition-colors`}
                onClick={() => setTransaction({ ...transaction, type: "expense" })}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Category</label>
            <select
              name="category"
              value={transaction.category}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md cursor-pointer appearance-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
              } focus:ring-2 focus:ring-[#065336] focus:border-[#065336]`}
              required
            >
              <option value="">Select category</option>
              {transaction.type === "income" ? (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Other">Other</option>
                </>
              ) : (
                expenseCategories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Amount</label>
            <div className="relative">
              <span className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>$</span>
              <input
                type="number"
                name="amount"
                value={transaction.amount}
                onChange={handleInputChange}
                className={`w-full p-3 pl-7 border rounded-md ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336]`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Description</label>
            <input
              type="text"
              name="description"
              value={transaction.description}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800"
              } focus:ring-2 focus:ring-[#065336] focus:border-[#065336]`}
              placeholder="Transaction description"
              required
            />
          </div>

          <div className="mb-6">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={transaction.date}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md cursor-pointer pr-10 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336]`}
                required
              />
              <span className={`absolute right-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className={`px-5 py-3 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              } rounded-md cursor-pointer font-medium`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-[#065336] hover:bg-[#054328] text-white rounded-md cursor-pointer font-medium"
            >
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransactionModal

