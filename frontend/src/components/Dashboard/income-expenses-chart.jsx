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
import { useCurrency } from "../../context/CurrencyContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const IncomeVsExpensesChart = () => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const { currency, formatCurrency, convertAmount, currencyConfig } =
    useCurrency();
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

  const displayData = data.map((item) => ({
    ...item,
    income: convertAmount(item.income, "NPR"),
    expenses: convertAmount(item.expenses, "NPR"),
  }));

  const totalIncome = displayData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = displayData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );
  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;
  const averageMonthlySavings =
    displayData.length > 0
      ? Math.round((totalIncome - totalExpenses) / displayData.length)
      : 0;

  const timeRangeOptions = ["Last 3 months", "Last 6 months", "Last year"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const incomeValue = payload[0].value;
      const expensesValue = payload[1].value;
      const savingsValue = incomeValue - expensesValue;

      return (
        <div
          className={`p-3 border rounded-lg shadow-md transform transition-all duration-200
            ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
        >
          <p className="font-semibold text-md mb-1">{label}</p>
          <p className="text-sm flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="font-medium">Income:</span>
            <span className="ml-1 font-semibold">
              {formatCurrency(incomeValue)}
            </span>
          </p>
          <p className="text-sm flex items-center mt-1">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="font-medium">Expenses:</span>
            <span className="ml-1 font-semibold">
              {formatCurrency(expensesValue)}
            </span>
          </p>
          <p className="text-sm flex items-center mt-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="font-medium">Savings:</span>
            <span className="ml-1 font-semibold">
              {formatCurrency(savingsValue)}
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
          <h2 className="text-lg md:text-xl font-semibold mb-1">
            Income vs Expenses
          </h2>
          <p
            className={`text-xs md:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Compare your income and expenses
          </p>
        </div>
        <div className="relative mt-2 sm:mt-0">
          <button
            className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 border rounded-lg text-xs md:text-sm cursor-pointer transition-colors duration-200 
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            aria-haspopup="true"
            aria-expanded={showTimeDropdown}
          >
            {timeRange}
            <ChevronDown
              className={`h-3 w-3 md:h-4 md:w-4 transition-transform duration-200 ${
                showTimeDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTimeDropdown && (
            <div
              className={`absolute right-0 mt-1 w-36 md:w-48 rounded-lg shadow-lg border 
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }
              z-10 transform transition-all duration-300 animate-slideDown`}
            >
              {timeRangeOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm cursor-pointer transition-colors duration-200 
                  ${
                    darkMode
                      ? "hover:bg-gray-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                  ${
                    timeRange === option
                      ? darkMode
                        ? "bg-gray-600"
                        : "bg-gray-100"
                      : ""
                  }`}
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
        <div className="flex flex-col justify-center items-center h-[250px] md:h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-blue-500"></div>
          <span
            className={`mt-3 text-xs md:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading chart data...
          </span>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-[250px] md:h-[350px]">
          <p
            className={`text-center text-xs md:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No income/expense data available for the selected period.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[250px] md:h-[300px] lg:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={displayData}
                margin={{
                  top: 5,
                  right: 10,
                  left: window.innerWidth < 768 ? 5 : 20,
                  bottom: 5,
                }}
                barGap={4}
                barCategoryGap="20%"
                onMouseMove={(e) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    setHoveredBar(e.activeLabel);
                  }
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: darkMode ? "#9ca3af" : "#6b7280",
                    fontSize: window.innerWidth < 768 ? 10 : 12,
                  }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{
                    fill: darkMode ? "#9ca3af" : "#6b7280",
                    fontSize: window.innerWidth < 768 ? 10 : 12,
                  }}
                  tickFormatter={(value) => {
                    const config = currencyConfig
                      ? currencyConfig[currency]
                      : { symbol: currency };
                    const symbol = config?.symbol || "";

                    if (value >= 1000000) {
                      return `${symbol}${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${symbol}${(value / 1000).toFixed(1)}K`;
                    } else {
                      return formatCurrency(value);
                    }
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={window.innerWidth < 768 ? 60 : 80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={window.innerWidth < 768 ? 30 : 36}
                  iconSize={window.innerWidth < 768 ? 8 : 10}
                  iconType="circle"
                  formatter={(value) => (
                    <span
                      style={{
                        color: darkMode
                          ? value === "income"
                            ? "#4ade80"
                            : "#f87171"
                          : value === "income"
                          ? "#16a34a"
                          : "#ef4444",
                        fontSize: window.innerWidth < 768 ? 10 : 12,
                      }}
                    >
                      {value === "income" ? "Income" : "Expenses"}
                    </span>
                  )}
                />
                <Bar
                  dataKey="income"
                  name="income"
                  fill={darkMode ? "#4ade80" : "#16a34a"}
                  radius={[4, 4, 0, 0]}
                  barSize={window.innerWidth < 768 ? 8 : 16}
                  animationDuration={1500}
                />
                <Bar
                  dataKey="expenses"
                  name="expenses"
                  fill={darkMode ? "#f87171" : "#ef4444"}
                  radius={[4, 4, 0, 0]}
                  barSize={window.innerWidth < 768 ? 8 : 16}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mt-4 text-center">
            <StatBox
              label="Total Income"
              value={formatCurrency(totalIncome)}
              color={darkMode ? "#4ade80" : "#16a34a"}
            />
            <StatBox
              label="Total Expenses"
              value={formatCurrency(totalExpenses)}
              color={darkMode ? "#f87171" : "#ef4444"}
            />
            <StatBox
              label="Savings Rate"
              value={`${savingsRate}%`}
              color={darkMode ? "#60a5fa" : "#3b82f6"}
            />
            <StatBox
              label="Avg. Monthly Savings"
              value={formatCurrency(averageMonthlySavings)}
              color={darkMode ? "#818cf8" : "#6366f1"}
            />
          </div>
        </>
      )}
    </div>
  );
};

const StatBox = ({ label, value, color }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-2 md:p-3 rounded-lg ${
        darkMode ? "bg-gray-700" : "bg-gray-50"
      } transition-all duration-200 hover:shadow-md`}
    >
      <p className="text-xs md:text-sm font-medium opacity-75 mb-1">{label}</p>
      <p className="text-sm md:text-base font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
};

export default IncomeVsExpensesChart;
