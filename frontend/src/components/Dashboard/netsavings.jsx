import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChevronDown } from "lucide-react";
import LoadingSpinner from "../UI/LoadingSpinner";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const NetSavings = () => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const { currency, formatCurrency, convertAmount } = useCurrency();
  const [rawData, setRawData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [loading, setLoading] = useState(true);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [dataMinMax, setDataMinMax] = useState({ min: 0, max: 0 });
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = getToken();

      try {
        const response = await fetch(
          `${BACKEND_URL}/profile/net-saving-trend?n=${
            timeRange === "Last 3 months"
              ? 3
              : timeRange === "Last 6 months"
              ? 6
              : 12
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch savings data");

        const data = await response.json();
        setRawData(data.savings_trend || []);
      } catch (error) {
        console.error("Error fetching savings data:", error);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, getToken]);

  useEffect(() => {
    if (loading || !rawData.length) {
      if (!loading && !rawData.length) {
        setSavingsData([]);
        setDataMinMax({ min: 0, max: 0 });
      }
      return;
    }

    const formattedAndConvertedData = rawData.map(
      ({ year, month, savings }) => ({
        month: new Date(year, month - 1).toLocaleString("default", {
          month: "short",
        }),
        value: convertAmount(Number(savings), "NPR", currency),
      })
    );

    setSavingsData(formattedAndConvertedData);

    const values = formattedAndConvertedData.map((item) => item.value);
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      setDataMinMax({ min, max });
    } else {
      setDataMinMax({ min: 0, max: 0 });
    }
  }, [rawData, currency, convertAmount, loading]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      const color = isPositive
        ? darkMode
          ? "#4ade80"
          : "#15803d"
        : darkMode
        ? "#f87171"
        : "#dc2626";

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
            <span className={`font-medium mr-1`}>Net Savings:</span>
            <span className={`font-bold`} style={{ color }}>
              {formatCurrency(value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const calculateYDomain = () => {
    if (savingsData.length === 0) return [0, 100];

    const { min, max } = dataMinMax;
    const padding = Math.max(Math.abs(max), Math.abs(min)) * 0.1 || 10;

    let domainMin = min;
    let domainMax = max;

    if (min >= 0 && max >= 0) {
      domainMin = 0;
      domainMax = max + padding;
    } else if (min <= 0 && max <= 0) {
      domainMin = min - padding;
      domainMax = 0;
    } else {
      domainMin = min - padding;
      domainMax = max + padding;
    }
    if (domainMin === domainMax && savingsData.length > 0) {
      return [domainMin - 10, domainMax + 10];
    }
    return [domainMin, domainMax];
  };

  return (
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        hover:shadow-md h-full`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Net Savings Trend</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Your savings accumulation over time
          </p>
        </div>
        <div className="relative mt-2 sm:mt-0">
          <button
            className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm cursor-pointer transition-colors duration-200 
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          >
            {timeRange}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showTimeDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTimeDropdown && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border 
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }
              z-10 transform transition-all duration-300 animate-slideDown`}
            >
              {["Last 3 months", "Last 6 months", "Last year"].map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-200 
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
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && savingsData.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[300px]">
          <LoadingSpinner text="Loading savings data..." />
        </div>
      ) : !loading && savingsData.length === 0 ? (
        <div className="flex justify-center items-center h-[300px]">
          <p
            className={`text-center text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No savings data available for the selected period.
          </p>
        </div>
      ) : (
        <div className="h-[300px] w-full" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={savingsData}
              margin={{ top: 20, right: 10, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="positiveSavingsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={darkMode ? "#4ade80" : "#15803d"}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={darkMode ? "#4ade80" : "#15803d"}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="negativeSavingsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={darkMode ? "#f87171" : "#dc2626"}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor={darkMode ? "#f87171" : "#dc2626"}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => {
                  const absValue = Math.abs(value);
                  if (absValue >= 1000000)
                    return formatCurrency(value / 1000000) + "M";
                  if (absValue >= 1000)
                    return formatCurrency(value / 1000) + "k";
                  return formatCurrency(value);
                }}
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                dx={-5}
                domain={calculateYDomain()}
                allowDataOverflow={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: darkMode ? "#4a5568" : "#d1d5db",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />
              <ReferenceLine
                y={0}
                stroke={darkMode ? "#6b7280" : "#9ca3af"}
                strokeDasharray="3 3"
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={darkMode ? "#4ade80" : "#15803d"}
                fill="url(#positiveSavingsGradient)"
                fillOpacity={1}
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: darkMode ? "#4ade80" : "#15803d",
                  stroke: darkMode ? "#1f2937" : "#ffffff",
                }}
                dot={false}
                isAnimationActive={true}
                connectNulls={false}
                filter={(item) => item.value >= 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NetSavings;
