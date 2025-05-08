"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";

const DailyExpensesChart = ({ data }) => {
  const { darkMode } = useTheme();
  const { currency, convertAmount, formatCurrency } = useCurrency();

  const chartData = Array.isArray(data)
    ? data.map((day) => ({
        date: day.date,
        amount: convertAmount(parseFloat(day.expense), "NPR", currency),
        originalAmount: parseFloat(day.expense),
      }))
    : [];

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
          tickFormatter={(value) => formatCurrency(value, undefined, true)}
          tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: darkMode ? "rgba(55, 65, 81, 0.3)" : "rgba(0, 0, 0, 0.05)",
          }}
        />
        <Bar
          dataKey="amount"
          fill={darkMode ? "#ef4444" : "#f87171"} // Lighter red for better contrast
          stroke={darkMode ? "#7f1d1d" : "#b91c1c"} // Darker stroke for better visibility
          strokeWidth={2}
          radius={[4, 4, 0, 0]}
          barSize={40}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyExpensesChart;
