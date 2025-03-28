"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChevronDown } from "lucide-react"

const IncomeVsExpensesChart = ({ darkMode }) => {
  const [timeRange, setTimeRange] = useState("Last 6 months")
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)

  const data = [
    { month: "Jan", income: 5000, expenses: 3100 },
    { month: "Feb", income: 5500, expenses: 3000 },
    { month: "Mar", income: 4800, expenses: 2800 },
    { month: "Apr", income: 5100, expenses: 3000 },
    { month: "May", income: 5200, expenses: 3200 },
    { month: "Jun", income: 5600, expenses: 3300 },
  ]

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
  const averageMonthlySavings = Math.round((totalIncome - totalExpenses) / data.length)

  const timeRangeOptions = ["Last 3 months", "Last 6 months", "Last year"]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} p-3 border rounded-md shadow-md`}
        >
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium text-green-500">Income:</span> ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-red-500">Expenses:</span> ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium text-blue-500">Savings:</span> $
            {(payload[0].value - payload[1].value).toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} w-full`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold">Income vs Expenses</h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Compare your income and expenses</p>
        </div>
        <div className="relative">
          <button
            className={`flex items-center gap-1 px-3 py-2 border rounded-md text-sm cursor-pointer ${
              darkMode ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            {timeRange} <ChevronDown className="h-4 w-4" />
          </button>
          {showTimeDropdown && (
            <div
              className={`absolute right-0 mt-1 w-40 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              } border rounded-md shadow-lg z-10`}
            >
              {timeRangeOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} cursor-pointer text-sm`}
                  onClick={() => {
                    setTimeRange(option)
                    setShowTimeDropdown(false)
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={0}
            barCategoryGap="20%"
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setHoveredBar(e.activePayload[0].payload)
              }
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={[0, "dataMax + 1000"]}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: darkMode ? "rgba(55, 65, 81, 0.3)" : "rgba(0, 0, 0, 0.05)" }}
            />
            <Legend wrapperStyle={{ bottom: 0 }} />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} cursor="pointer" />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Savings Rate</p>
          <p className="text-2xl font-bold">{savingsRate}%</p>
        </div>
        <div className="text-center">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Average Monthly Savings</p>
          <p className="text-2xl font-bold">${averageMonthlySavings.toLocaleString()}</p>
        </div>
      </div>

      {hoveredBar && (
        <div className={`mt-2 p-2 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-md`}>
          <h3 className="font-medium text-center">{hoveredBar.month} Details</h3>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="text-center">
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Income</p>
              <p className="font-medium text-green-500">${hoveredBar.income.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Expenses</p>
              <p className="font-medium text-red-500">${hoveredBar.expenses.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Savings</p>
              <p className="font-medium text-blue-500">${(hoveredBar.income - hoveredBar.expenses).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IncomeVsExpensesChart

