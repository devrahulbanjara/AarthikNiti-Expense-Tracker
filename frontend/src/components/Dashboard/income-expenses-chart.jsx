import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const IncomeVsExpensesChart = () => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const n =
          timeRange === "Last 3 months"
            ? 3
            : timeRange === "Last 6 months"
            ? 6
            : 12;
        const response = await fetch(
          `${BACKEND_URL}/profile/income-expense-trend?n=${n}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch income/expense data");
        }

        const result = await response.json();
        console.log(
          "Income/Expense Trend Data from Backend:",
          result.income_expense_trend
        );

        const formattedData = result.income_expense_trend.map((item) => ({
          month: new Date(item.year, item.month - 1).toLocaleString("default", {
            month: "short",
          }),
          income: item.income,
          expenses: item.expense,
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching income/expense trend data:", error);
        setData([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;
  const averageMonthlySavings =
    data.length > 0
      ? Math.round((totalIncome - totalExpenses) / data.length)
      : 0;

  const timeRangeOptions = ["Last 3 months", "Last 6 months", "Last year"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 border rounded-lg shadow-md transform transition-all duration-200
            ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}
        >
          <p className="font-semibold text-md mb-1">{label}</p>
          <p className="text-sm flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="font-medium">Income:</span>
            <span className="ml-1 font-semibold">
              ${payload[0].value.toLocaleString()}
            </span>
          </p>
          <p className="text-sm flex items-center mt-1">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="font-medium">Expenses:</span>
            <span className="ml-1 font-semibold">
              ${payload[1].value.toLocaleString()}
            </span>
          </p>
          <p className="text-sm flex items-center mt-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="font-medium">Savings:</span>
            <span className="ml-1 font-semibold">
              ${(payload[0].value - payload[1].value).toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300 
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        hover:shadow-md w-full`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Income vs Expenses</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Compare your income and expenses
          </p>
        </div>
        <div className="relative mt-2 sm:mt-0">
          <button
            className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm cursor-pointer transition-colors duration-200 
              ${darkMode 
                ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" 
                : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"}`}
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            aria-haspopup="true"
            aria-expanded={showTimeDropdown}
          >
            {timeRange} 
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${showTimeDropdown ? 'rotate-180' : ''}`} 
            />
          </button>
          {showTimeDropdown && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border 
              ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}
              z-10 transform transition-all duration-300 animate-slideDown`}
            >
              {timeRangeOptions.map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-200 
                  ${darkMode ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-700"}
                  ${timeRange === option ? (darkMode ? 'bg-gray-600' : 'bg-gray-100') : ''}`}
                  onClick={() => {
                    setTimeRange(option);
                    setShowTimeDropdown(false);
                  }}
                  role="option"
                  aria-selected={timeRange === option}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-[350px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading chart data...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-[350px]">
          <p className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No income/expense data available for the selected period.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 0, left: -15, bottom: 5 }}
                barGap={4}
                barCategoryGap="20%"
                onMouseMove={(e) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    setHoveredBar(e.activePayload[0].payload);
                  }
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  iconSize={10}
                  wrapperStyle={{ top: -10, right: 0 }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={darkMode ? "#10b981" : "#059669"}
                  stroke={darkMode ? "#ffffff" : "#000000"}
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill={darkMode ? "#ef4444" : "#dc2626"}
                  stroke={darkMode ? "#ffffff" : "#000000"}
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeVsExpensesChart;
