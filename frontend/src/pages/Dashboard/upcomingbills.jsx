"use client"

import { useState } from "react"

const UpcomingBills = ({ darkMode }) => {
  const [bills, setBills] = useState([
    { id: 1, name: "Phone", category: "Bills", dueIn: "-6 days", amount: 45.0, paid: false },
    { id: 2, name: "Gym Membership", category: "Health", dueIn: "-4 days", amount: 29.99, paid: true },
    { id: 3, name: "Internet", category: "Bills", dueIn: "tomorrow", amount: 79.99, paid: false },
    { id: 4, name: "Rent", category: "Housing", dueIn: "7 days", amount: 1200.0, paid: true },
  ])

  const [activeDropdown, setActiveDropdown] = useState(null)

  const togglePaid = (id) => {
    setBills(bills.map((bill) => (bill.id === id ? { ...bill, paid: !bill.paid } : bill)))
  }

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}
    >
      <h2 className="text-lg font-semibold mb-1">Upcoming Bills</h2>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>Bills due in the next 30 days</p>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`border rounded-lg p-4 flex justify-between items-center ${
              darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <span className={`text-xs px-2 py-0.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                  {bill.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Due {bill.dueIn}</div>
              <div className="font-semibold">${bill.amount.toFixed(2)}</div>
              <div className="flex items-center">
                <button
                  onClick={() => togglePaid(bill.id)}
                  className={`w-10 h-5 rounded-full ${bill.paid ? "bg-[#065336]" : darkMode ? "bg-gray-600" : "bg-gray-200"} relative cursor-pointer hover:opacity-90`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${bill.paid ? "left-5" : "left-1"}`}
                  ></div>
                </button>
              </div>
              <div className="relative">
                <button
                  className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"} cursor-pointer`}
                  onClick={() => toggleDropdown(bill.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === bill.id && (
                  <div
                    className={`absolute right-0 mt-1 w-36 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} rounded-md border z-10`}
                  >
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} cursor-pointer`}
                      onClick={() => {
                        togglePaid(bill.id)
                        setActiveDropdown(null)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mark as paid
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} cursor-pointer`}
                      onClick={() => {
                        alert(`Reminder set for ${bill.name}`)
                        setActiveDropdown(null)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Set reminder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingBills
