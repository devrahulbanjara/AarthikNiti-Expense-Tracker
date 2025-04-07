"use client"

import { useState } from "react"
import { useTheme } from "../../context/ThemeContext"

const UpcomingBills = () => {
  const { darkMode } = useTheme()

  const [bills, setBills] = useState([
    { id: 1, name: "Phone", category: "Bills", dueIn: "-6 days", amount: 45.0, paid: false },
    { id: 2, name: "Gym Membership", category: "Health", dueIn: "-4 days", amount: 29.99, paid: true },
    { id: 3, name: "Internet", category: "Bills", dueIn: "tomorrow", amount: 79.99, paid: false },
    { id: 4, name: "Rent", category: "Housing", dueIn: "7 days", amount: 1200.0, paid: true },
  ])

  const [filter, setFilter] = useState('All')  // Initial filter is set to 'All'

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredBills = filter === 'All' ? bills : bills.filter(bill => bill.category === filter)

  const togglePaid = (id) => {
    setBills(bills.map((bill) => (bill.id === id ? { ...bill, paid: !bill.paid } : bill)))
  }

  return (
    <div
      className={`${darkMode ? "bg-[#111827]" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-800" : "border-gray-300"} h-full transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-1">Upcoming Bills</h2>

        {/* Filter Dropdown */}
        <div className="relative inline-block">
          <select
            value={filter}
            onChange={handleFilterChange}
            className={`p-3 pl-10 pr-4 rounded-lg border ${darkMode ? "bg-[#1f2937] text-white border-gray-700" : "bg-white text-gray-700 border-gray-300"} transition-all duration-300 appearance-none`}
          >
            <option value="All">All</option>
            <option value="Bills">Bills</option>
            <option value="Health">Health</option>
            <option value="Housing">Housing</option>
          </select>

          {/* Filter Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4 transition-colors duration-300`}>
        Bills due in the next 30 days
      </p>

      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <div
            key={bill.id}
            className={`border rounded-lg p-4 flex justify-between items-center ${darkMode ? "border-gray-800 hover:bg-[#1f2937]" : "border-gray-200 hover:bg-gray-50"} transition-all duration-300`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <span className={`text-xs px-2 py-0.5 ${darkMode ? "bg-[#1f2937]" : "bg-gray-100"} rounded-full transition-colors duration-300`}>
                  {bill.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-300`}>
                Due {bill.dueIn}
              </div>
              <div className="font-semibold">${bill.amount.toFixed(2)}</div>
              <div className="flex items-center">
                <button
                  onClick={() => togglePaid(bill.id)}
                  className={`w-10 h-5 rounded-full ${
                    bill.paid ? "bg-[#065336]" : darkMode ? "bg-gray-700" : "bg-gray-200"
                  } relative cursor-pointer hover:opacity-90 transition-all duration-300`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${bill.paid ? "left-5" : "left-1"}`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingBills