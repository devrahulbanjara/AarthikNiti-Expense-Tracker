"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useTheme } from "../../context/ThemeContext"

const IncomeOverview = ({ chartData, timeRange, setTimeRange }) => {
  const { darkMode } = useTheme()

  const sampleData = [
    { day: "Mon", amount: 250000 },
    { day: "Tue", amount: 120000 },
    { day: "Wed", amount: 320000 },
    { day: "Thu", amount: 150000 },
    { day: "Fri", amount: 420000 },
    { day: "Sat", amount: 280000 },
    { day: "Sun", amount: 190000 },
  ]

  // Use sample data if chartData is empty or has zero values
  const displayData = chartData.every((item) => item.amount === 0) ? sampleData : chartData

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={`${darkMode ? "bg-[#111827]" : "bg-white"} p-6 transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Income Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`${darkMode ? "bg-[#1f2937] text-white" : "bg-gray-100 text-gray-800"} border-0 rounded-lg px-3 py-2 text-sm transition-colors duration-300`}
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      {/* Increased height for bigger chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 30, left: 50, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value === 0) return "$0"
                if (value >= 1000) return `${value / 1000}k`
                return value
              }}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
              width={60}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: darkMode ? "#1f2937" : "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ fill: darkMode ? "rgba(55, 65, 81, 0.4)" : "rgba(243, 244, 246, 0.6)" }}
              labelStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }}
            />
            <Bar
              dataKey="amount"
              fill="#065336"
              radius={[4, 4, 0, 0]}
              barSize={50}
              animationDuration={1000}
              name="Amount"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default IncomeOverview;