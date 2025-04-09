"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const DailyExpensesChart = ({ data }) => {
  const { darkMode } = useTheme();

  const [activeBar, setActiveBar] = useState(null);

  const chartData = data.map((day) => ({
    day: day.date,
    amount: day.income,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 ${darkMode ? "bg-gray-700" : "bg-white"} border ${
            darkMode ? "border-gray-600" : "border-gray-200"
          } rounded-md shadow-md`}
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
  console.log(chartData);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap={20} 
            onMouseMove={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                setActiveBar(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveBar(null)}
          >
            {/* CartesianGrid removed to avoid double horizontal line */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
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
              dataKey="amount"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={50}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyExpensesChart;
