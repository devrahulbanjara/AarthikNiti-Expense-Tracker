"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const IncomeOverview = ({ timeRange, setTimeRange }) => {
  const { darkMode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true);
      try {
        const days =
          timeRange === "Last 7 days"
            ? 7
            : timeRange === "Last 30 days"
            ? 30
            : timeRange === "Last 3 months"
            ? 90
            : 180;

        const response = await fetch(
          `http://127.0.0.1:8000/profile/transaction-trend?transaction_type=income&days=${days}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch income data");

        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 rounded-md shadow-md ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
          }`}
        >
          <p className="font-medium">{label}</p>
          <p className="text-sm font-semibold">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`${
        darkMode ? "bg-[#111827]" : "bg-white"
      } p-6 transition-colors duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Income Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`${
            darkMode ? "bg-[#1f2937] text-white" : "bg-gray-100 text-gray-800"
          } border-0 rounded-lg px-3 py-2 text-sm transition-colors duration-300`}
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
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: darkMode
                    ? "rgba(55, 65, 81, 0.3)"
                    : "rgba(0, 0, 0, 0.05)",
                }}
              />
              <Bar
                dataKey="income"
                fill="#10b981" // Green color for income
                stroke={darkMode ? "#065f46" : "#047857"} // Stroke for bars
                strokeWidth={1.5}
                radius={[4, 4, 0, 0]}
                barSize={40} // Consistent bar size
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default IncomeOverview;
