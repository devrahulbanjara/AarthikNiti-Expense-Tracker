import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useLocation } from "react-router-dom";

const ExpensesBreakdown = ({ totalExpenses }) => {
  const { darkMode } = useTheme();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expenseBreakdownData, setExpenseBreakdownData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  const fetchExpenseBreakdownData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/profile/expense-breakdown",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching expense breakdown data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseBreakdownData();

    const intervalId = setInterval(() => {
      fetchExpenseBreakdownData();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
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
      }`}
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading expense data...</span>
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
          <div className="h-[220px] mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handlePieEnter}
                  onMouseLeave={handlePieLeave}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {showTooltip && tooltipData && (
              <div
                className={`absolute  ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                } border rounded-md p-3 z-20 transition-opacity duration-300 ease-in-out`}
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: "translate(10px, -50%)",
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
                : "grid-cols-3 "
            } gap-2`}
          >
            {expenseBreakdownData.map((entry, index) => {
              const percentage = (
                (entry.value / totalCalculated) *
                100
              ).toFixed(1);

              return (
                <div
                  key={`legend-${index}`}
                  className={`flex items-center gap-2  cursor-pointer ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } p-1 rounded transition-all duration-200 ${
                    activeIndex === index ? "scale-105 font-medium" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <div>
                    <div className="text-xs font-medium">{entry.name}</div>
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
