"use client"

import { useState, useEffect } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useTheme } from "../../context/ThemeContext"

const IncomeOverview = ({ timeRange, setTimeRange }) => {
  const { darkMode } = useTheme()
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true)
      try {
        const days =
          timeRange === "Last 7 days" ? 7 : timeRange === "Last 30 days" ? 30 : timeRange === "Last 3 months" ? 90 : 180

        console.log(`Fetching income data with days=${days}`)

        const response = await fetch(
          "http://127.0.0.1:8000/profile/transaction-trend?transaction_type=income&days=30",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          },
        )

        if (!response.ok) throw new Error("Failed to fetch income data")

        const data = await response.json()
        console.log("Income chart data:", data) 
        setChartData(data)
      } catch (error) {
        console.error("Error fetching income data:", error)
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchIncomeData()
  }, [timeRange])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
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

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="h-[470px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 50, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
                tickFormatter={formatDate}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  if (value === 0) return "$0"
                  if (value >= 1000) return `$${value / 1000}k`
                  return `$${value}`
                }}
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
                width={60}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => formatDate(label)}
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
                dataKey="income"
                fill="#065336"
                radius={[4, 4, 0, 0]}
                barSize={50}
                animationDuration={1000}
                name="Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default IncomeOverview;