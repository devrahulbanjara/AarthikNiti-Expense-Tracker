import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useLocation } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExpensesBreakdown = ({ totalExpenses }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expenseBreakdownData, setExpenseBreakdownData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const chartRef = useRef(null);
  const animationRef = useRef(null);

  const fetchExpenseBreakdownData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/expense-breakdown`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      console.log("Expense Data from Backend:", data.expense_breakdown);

      const breakdownData = Object.entries(data.expense_breakdown).map(
        ([category, value]) => {
          const categoryDetails = expenseCategories.find(
            (cat) => cat.name.toLowerCase() === category.toLowerCase()
          );

          return {
            name: category,
            value,
            color: categoryDetails ? categoryDetails.color : "#cccccc", // Default color if not found
          };
        }
      );

      setExpenseBreakdownData(breakdownData);
      startAnimation();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching expense breakdown data:", error);
      setIsLoading(false);
    }
  };

  const startAnimation = () => {
    // Reset animation progress
    setAnimationProgress(0);
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    let startTime;
    const animationDuration = 1500; // 1.5 seconds
    
    const animateChart = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateChart);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateChart);
  };

  useEffect(() => {
    fetchExpenseBreakdownData();

    const intervalId = setInterval(() => {
      fetchExpenseBreakdownData();
    }, 300000);

    return () => {
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    const { darkMode } = useTheme();

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 3}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.9}
          stroke={darkMode ? "#ffffff" : "#000000"}
          strokeWidth={darkMode ? 1.5 : 0.8}
          className="filter drop-shadow-md"
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 13}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={darkMode ? "#ffffff" : "#000000"}
          strokeWidth={darkMode ? 0.8 : 0.5}
          opacity={0.5}
        />
      </g>
    );
  };

  const handlePieEnter = (_, index) => {
    setActiveIndex(index);
    setShowTooltip(true);
    setTooltipData(expenseBreakdownData[index]);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
    setShowTooltip(false);
    setTooltipData(null);
  };

  const location = useLocation();

  // Calculate the total dynamically
  const totalCalculated = expenseBreakdownData.reduce(
    (sum, entry) => sum + entry.value,
    0
  );

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } h-full w-full ${
        location.pathname === "/dashboard" ? "max-w-md" : "w-full"
      } transition-all duration-300 hover:shadow-lg overflow-y-auto`}
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <div className="relative h-36 w-36">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-4 border-gray-200 border-opacity-30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
              </div>
            </div>
            <span className="mt-4 text-sm text-center">Loading expense data...</span>
          </div>
        </div>
      ) : expenseBreakdownData.length === 0 ? (
        <p
          className={`text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          } py-4`}
        >
          No expense data available
        </p>
      ) : (
        <>
          <div className="h-[260px] mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={67}
                  outerRadius={93}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handlePieEnter}
                  onMouseLeave={handlePieLeave}
                  startAngle={90}
                  endAngle={animationProgress * 360 + 90}
                  animationBegin={0}
                  animationDuration={0}
                  isAnimationActive={false}
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={darkMode ? "#ffffff" : "#000000"}
                      strokeWidth={darkMode ? 1.5 : 0.8}
                      className="filter drop-shadow-sm"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {showTooltip && tooltipData && (
              <div
                className={`absolute ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                } border rounded-md p-3 z-20 shadow-lg transition-all duration-300 ease-in-out transform`}
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: "translate(10px, -50%) scale(1)",
                  opacity: showTooltip ? 1 : 0,
                }}
              >
                <p
                  className="font-medium text-lg"
                  style={{ color: tooltipData.color }}
                >
                  {tooltipData.name}
                </p>
                <p className="text-md font-semibold">
                  ${tooltipData.value.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {((tooltipData.value / totalCalculated) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          <div
            className={`grid ${
              location.pathname === "/dashboard"
                ? "grid-cols-2"
                : expenseBreakdownData.length > 9
                  ? "grid-cols-4"
                  : expenseBreakdownData.length > 6
                    ? "grid-cols-3"
                    : "grid-cols-3"
            } gap-2 max-h-[400px] overflow-y-auto pr-1`}
          >
            {expenseBreakdownData.map((entry, index) => {
              const percentage = (
                (entry.value / totalCalculated) *
                100
              ).toFixed(1);

              return (
                <div
                  key={`legend-${index}`}
                  className={`flex items-center gap-2 cursor-pointer ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } p-1 rounded transition-all duration-200 ${
                    activeIndex === index ? "scale-105 font-medium" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-medium truncate max-w-[100px]">{entry.name}</div>
                    <div
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesBreakdown;
