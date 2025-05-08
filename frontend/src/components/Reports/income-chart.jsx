import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
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

const IncomeChart = () => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  useEffect(() => {
    const fetchIncomeTrend = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(
          `${BACKEND_URL}/profile/transaction-trend?transaction_type=income&days=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch income trend data");
        const data = await res.json();
        const formatted = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          amount: item.amount,
        }));
        setIncomeData(formatted);
      } catch (error) {
        console.error(error);
        setIncomeData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomeTrend();
  }, [timeRange, getToken]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 border rounded shadow ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
          }`}
        >
          <div>{label}</div>
          <div>
            <strong>${payload[0].value.toLocaleString()}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative mt-6 p-4 border rounded ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <h3 className="text-lg font-semibold mb-8">Income Trend</h3>
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className="border px-2 py-1 rounded cursor-pointer"
          >
            Last {timeRange} days{" "}
            <ChevronDown
              className={`inline-block ml-1 h-4 w-4 transition-transform ${
                showTimeDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTimeDropdown && (
            <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10 w-40">
              {[7, 15, 30].map((days) => (
                <div
                  key={days}
                  className={`cursor-pointer px-2 py-1 hover:bg-gray-200 ${
                    timeRange === days ? "font-bold bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setTimeRange(days);
                    setShowTimeDropdown(false);
                  }}
                >
                  Last {days} days
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner text="Loading income data..." />
        </div>
      ) : incomeData.length === 0 ? (
        <p>No income data found for selected period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={incomeData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              stroke={darkMode ? "#cbd5e1" : "#374151"}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <YAxis
              stroke={darkMode ? "#cbd5e1" : "#374151"}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              tick={{ fill: darkMode ? "#9ca3af" : "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#8884d8" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#34d399"
              fill="#34d399"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default IncomeChart;
