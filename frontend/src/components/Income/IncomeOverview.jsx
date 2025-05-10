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
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const IncomeOverview = ({ timeRange, onTimeRangeChange, refreshKey }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const { currency, formatCurrency, convertAmount } = useCurrency();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchIncomeData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const days = parseInt(timeRange);

        const response = await fetch(
          `${BACKEND_URL}/profile/transaction-trend?transaction_type=income&days=${days}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch income data");

        const data = await response.json();
        console.log("Raw API response:", data);

        // Transform the data to match the expected format
        const transformedData = data.map((item) => ({
          date: item.date,
          income: parseFloat(item.income),
          // Store the original income amount
          originalIncome: parseFloat(item.income),
        }));

        console.log("Transformed data:", transformedData);
        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching income data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, [timeRange, getToken, refreshKey, currency]);

  // Convert all income values to the selected currency
  const convertedChartData = chartData.map((item) => ({
    ...item,
    income: convertAmount(item.originalIncome, "NPR", currency),
  }));

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
            {formatCurrency(payload[0].value)}
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
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className={`${
            darkMode ? "bg-[#1f2937] text-white" : "bg-gray-100 text-gray-800"
          } border-0 rounded-lg px-3 py-2 text-sm transition-colors duration-300`}
        >
          <option value="7">Last 7 days</option>
          <option value="15">Last 15 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
          <span
            className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading income data...
          </span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center items-center h-80">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No income data available for the selected time range.
          </p>
        </div>
      ) : (
        <div className="h-[300px] md:h-[400px] lg:h-[470px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={convertedChartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: darkMode ? "#9ca3af" : "#6b7280",
                  fontSize: windowWidth < 768 ? 10 : 12,
                }}
                tickLine={false}
                axisLine={false}
                height={40}
                interval={windowWidth < 768 ? 1 : 0}
              />
              <YAxis
                tickFormatter={(value) =>
                  formatCurrency(value, undefined, true)
                }
                tick={{
                  fill: darkMode ? "#9ca3af" : "#6b7280",
                  fontSize: windowWidth < 768 ? 10 : 12,
                }}
                tickLine={false}
                axisLine={false}
                width={windowWidth < 768 ? 40 : 60}
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
                barSize={windowWidth < 768 ? 20 : 40} // Smaller bar size on mobile
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
