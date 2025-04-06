"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const DailyExpensesChart = ({ darkMode, data }) => {
  const [activeBar, setActiveBar] = useState(null)
  const maxExpense = Math.max(...data.map((day) => day.amount), 100)

  const chartData = data.map((day) => ({
    day: day.day,
    amount: day.amount,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 ${darkMode ? "bg-gray-700" : "bg-white"} border ${darkMode ? "border-gray-600" : "border-gray-200"} rounded-md shadow-md`}
        >
          <p className="font-medium">{label}</p>
          <p className="text-sm font-semibold">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap={50}
            onMouseMove={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                setActiveBar(e.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveBar(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: darkMode ? "rgba(55, 65, 81, 0.3)" : "rgba(0, 0, 0, 0.05)" }}
            />
            <Bar
              dataKey="amount"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DailyExpensesChart;