import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const IncomeChart = ({ data, darkMode }) => {
  // Determine the maximum income for scaling
  const maxAmount = Math.max(...data.map((day) => day.amount), 1);
  const scaleFactor = maxAmount < 1 ? 100 : 1; // Boost height if values are too low

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Income Overview
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Your income trends over time
      </p>
      
      {/* Increased height from 250px to 400px */}
      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fill: darkMode ? "#fff" : "#000" }} />
          <YAxis
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tick={{ fill: darkMode ? "#fff" : "#000" }}
          />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Bar
            dataKey="amount"
            fill={darkMode ? "#3B82F6" : "#2563EB"}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Sample Data
const sampleData = [
  { day: "Fri", amount: 0.2 },
  { day: "Sat", amount: 0.15 },
  { day: "Sun", amount: 0.1 },
  { day: "Mon", amount: 0.1 },
  { day: "Tue", amount: 0.1 },
  { day: "Wed", amount: 0.1 },
  { day: "Thu", amount: 0.1 },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <IncomeChart data={sampleData} darkMode={false} />
    </div>
  );
}
