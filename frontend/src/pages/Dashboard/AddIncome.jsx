import { useState, useEffect } from "react"
import { Calendar, X } from 'lucide-react'

const AddIncome = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingIncome = null, 
  incomeSources,
  darkMode 
}) => {
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    recurring: false,
  })

  useEffect(() => {
    if (editingIncome) {
      setNewIncome({
        source: editingIncome.source,
        amount: editingIncome.amount,
        description: editingIncome.description,
        date: editingIncome.date,
        recurring: editingIncome.recurring,
      })
    } else if (isOpen) {
      setNewIncome({
        source: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        recurring: false,
      })
    }
  }, [editingIncome, isOpen])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewIncome((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const incomeToAdd = {
      id: editingIncome ? editingIncome.id : Date.now(),
      source: newIncome.source,
      amount: Number.parseFloat(newIncome.amount),
      description: newIncome.description,
      date: newIncome.date,
      recurring: newIncome.recurring,
    }
    
    onSubmit(incomeToAdd, editingIncome !== null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`relative ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg w-full max-w-md shadow-xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{editingIncome ? "Edit Income" : "Add Income"}</h2>
          <button
            className={`${darkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>Enter the details of your income</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Source</label>
            <select
              name="source"
              value={newIncome.source}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md cursor-pointer appearance-none ${
                darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select source</option>
              {incomeSources.map((source) => (
                <option key={source.name} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Amount</label>
            <div className="relative">
              <span className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>$</span>
              <input
                type="number"
                name="amount"
                value={newIncome.amount}
                onChange={handleInputChange}
                className={`w-full p-3 pl-7 border rounded-md ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={newIncome.date}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md cursor-pointer pr-10 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              <span className="absolute right-3 top-3 text-gray-500">
                <Calendar className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className={`px-5 py-3 rounded-md cursor-pointer font-medium ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 font-medium"
            >
              {editingIncome ? "Update" : "Add"} Income
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIncome
