import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import LoadingSpinner from "../UI/LoadingSpinner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AllTimeExpenseChart = ({
  currency = "NPR",
  formatCurrency,
  convertAmount,
}) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animatedData, setAnimatedData] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const animationRef = useRef(null);
  const chartRef = useRef(null);
  const [dataMinMax, setDataMinMax] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const fetchAllExpenseData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(
          `${BACKEND_URL}/profile/all-transactions?transaction_type=expense`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch all-time expense data");
        const data = await res.json();

        // Format daily data
        const formattedData = data.map((item) => {
          const date = new Date(item.date);
          // Format date for display - shorter format for x-axis
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          // Convert amount from NPR to selected currency
          const convertedAmount = convertAmount
            ? convertAmount(item.amount, "NPR", currency)
            : item.amount;

          return {
            fullDate: item.date,
            formattedDate,
            amount: convertedAmount,
            originalAmount: item.amount, // Keep original amount for reference
            // Store full date for tooltip
            tooltipDate: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          };
        });

        // Sort by date
        formattedData.sort(
          (a, b) => new Date(a.fullDate) - new Date(b.fullDate)
        );

        // Calculate min and max for better chart rendering
        const values = formattedData.map((item) => item.amount);
        const min = Math.min(...values);
        const max = Math.max(...values);
        setDataMinMax({ min, max });

        setExpenseData(formattedData);
        // Start with empty array for animation
        setAnimatedData([]);
      } catch (error) {
        console.error(error);
        setExpenseData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllExpenseData();
  }, [getToken, currency, convertAmount]);

  // Left to right animation effect for the chart data
  useEffect(() => {
    if (expenseData.length > 0 && !animationComplete) {
      setAnimatedData([]);
      setAnimationComplete(false);

      // Clear any existing animation
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }

      // Add items one by one with delay to create the left-to-right effect
      let currentIndex = 0;
      const animationDuration = 1200; // Total animation duration in ms
      const intervalTime = Math.min(animationDuration / expenseData.length, 40); // Time between each data point, but not too slow

      const animateData = () => {
        if (currentIndex < expenseData.length) {
          setAnimatedData((prevData) => [
            ...prevData,
            expenseData[currentIndex],
          ]);
          currentIndex++;
          animationRef.current = setTimeout(animateData, intervalTime);
        } else {
          setAnimationComplete(true);
        }
      };

      // Start animation after a brief delay - start a bit later than income chart
      animationRef.current = setTimeout(animateData, 500);

      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [expenseData, animationComplete]);

  // Calculate the appropriate domain based on data
  const calculateYDomain = () => {
    if (expenseData.length === 0) return [0, 0];

    const { min, max } = dataMinMax;
    const padding = max * 0.1; // Add 10% padding at the top

    return [0, max + padding]; // Expense should always start at 0
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 border rounded-lg shadow-lg transform transition-all duration-200 ${
            darkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-800 border-gray-200"
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {payload[0].payload.tooltipDate}
          </p>
          <p
            className={`text-lg font-bold ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            {formatCurrency
              ? formatCurrency(payload[0].value)
              : `${currency} ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartBg = darkMode ? "#1f2937" : "#ffffff";
  const gridColor = darkMode ? "#374151" : "#e5e7eb";
  const textColor = darkMode ? "#9ca3af" : "#6b7280";
  const expenseColor = darkMode ? "#f87171" : "#ef4444";

  return (
    <div
      className={`relative mt-6 p-4 border rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">Expense Trend</h3>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner text="Loading expense data..." />
        </div>
      ) : expenseData.length === 0 ? (
        <p>No expense data found.</p>
      ) : (
        <div className="overflow-hidden" ref={chartRef}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={animationComplete ? expenseData : animatedData}
              margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            >
              <defs>
                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={expenseColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={expenseColor}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
                tickCount={8}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke={textColor}
                tickFormatter={(value) =>
                  value >= 1000
                    ? `${currency.substring(0, 3)} ${(value / 1000).toFixed(
                        1
                      )}k`
                    : `${currency.substring(0, 3)} ${value}`
                }
                tick={{ fill: textColor, fontSize: 12 }}
                domain={calculateYDomain()}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: darkMode ? "#4a5568" : "#d1d5db",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => "Expense"}
                wrapperStyle={{
                  paddingBottom: "10px",
                  fontWeight: "bold",
                  color: expenseColor,
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                name="Expense"
                stroke={expenseColor}
                fillOpacity={0.6}
                fill="url(#expenseGradient)"
                strokeWidth={2}
                connectNulls={true}
                dot={{
                  r: 4,
                  strokeWidth: 1,
                  fill: expenseColor,
                  stroke: darkMode ? "#1f2937" : "#ffffff",
                }}
                activeDot={{
                  r: 6,
                  stroke: expenseColor,
                  strokeWidth: 2,
                  fill: darkMode ? "#1f2937" : "#ffffff",
                }}
                isAnimationActive={false} // We're handling our own animation
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AllTimeExpenseChart;
