"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChevronDown } from "lucide-react"

const IncomeVsExpensesChart = () => {
  const [timeRange, setTimeRange] = useState("Last 6 months")
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  // Sample data - you can replace this with your actual data
  const data = [
    { month: "Jan", income: 5000, expenses: 3100 },
    { month: "Feb", income: 5500, expenses: 3000 },
    { month: "Mar", income: 4800, expenses: 2800 },
    { month: "Apr", income: 5100, expenses: 3000 },
    { month: "May", income: 5200, expenses: 3200 },
    { month: "Jun", income: 5600, expenses: 3300 },
  ]

  // Calculate savings rate and average monthly savings
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const savingsRate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
  const averageMonthlySavings = Math.round((totalIncome - totalExpenses) / data.length)

  const timeRangeOptions = ["Last 3 months", "Last 6 months", "Last year", "Custom"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.month}</p>
          <p className="text-sm">
            <span className="font-medium">Income:</span> ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Expenses:</span> ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-medium">Savings:</span> ${(payload[0].value - payload[1].value).toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold">Income vs Expenses</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Compare your income and expenses</p>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm"
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            {timeRange} <ChevronDown className="h-4 w-4" />
          </button>
          {showTimeDropdown && (
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 border rounded-md shadow-lg z-10">
              {timeRangeOptions.map((option) => (
                <div
                  key={option}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
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
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={[0, "dataMax + 1000"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Legend wrapperStyle={{ bottom: 0 }} />
            <Bar dataKey="income" name="Income" fill="#000000" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#333333" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Savings Rate</p>
          <p className="text-2xl font-bold">{savingsRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Average Monthly Savings</p>
          <p className="text-2xl font-bold">${averageMonthlySavings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default IncomeVsExpensesChart

