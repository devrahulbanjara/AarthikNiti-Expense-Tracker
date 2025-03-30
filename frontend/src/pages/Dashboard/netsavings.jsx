"use client";

import { useState, useEffect, useRef } from "react";

const NetSavings = ({ darkMode }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [savingsData, setSavingsData] = useState([]);
  const [timeRange, setTimeRange] = useState("Last 3 months");
  const [loading, setLoading] = useState(true); // Loading state
  const chartRef = useRef(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // These will be dynamic based on fetched data

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/profile/net-saving-trend?n=${
          timeRange === "Last 3 months"
            ? 3
            : timeRange === "Last 6 months"
            ? 6
            : 12
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const formattedData = data.savings_trend.map((item) => ({
        month: new Date(item.year, item.month - 1).toLocaleString("default", {
          month: "short",
        }), // Converts month number to short month name
        value: item.savings,
      }));
      setSavingsData(formattedData);
      setLoading(false); // Stop loading after data is fetched
    };

    fetchData();
  }, [timeRange]);

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Ensure savingsData is available before calculating points
  const chartWidth = 100;
  const chartHeight = 100;
  const points = savingsData.length
    ? savingsData.map((data, index) => {
        const x = (index / (savingsData.length - 1)) * chartWidth;
        const y =
          chartHeight -
          (data.value / Math.max(...savingsData.map((d) => d.value))) *
            chartHeight;
        return { x, y, ...data };
      })
    : [];

  const createAreaPath = () => {
    if (points.length === 0) return ""; // Return an empty path if no points

    let path = `M${points[0].x},${points[0].y}`;

    // Add curve points
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];

      // Control points for the curve
      const cp1x = prevPoint.x + (currPoint.x - prevPoint.x) / 3;
      const cp1y = prevPoint.y;
      const cp2x = prevPoint.x + (2 * (currPoint.x - prevPoint.x)) / 3;
      const cp2y = currPoint.y;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${currPoint.x},${currPoint.y}`;
    }

    // Complete the area by drawing to the bottom right, bottom left, and back to start
    path += ` L${points[points.length - 1].x},${chartHeight} L${
      points[0].x
    },${chartHeight} Z`;

    return path;
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } h-full`}
    >
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Net Savings Trend</h2>
        <select
          className={`text-sm border rounded-md px-2 py-1 cursor-pointer ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>Last 3 months</option>
        </select>
      </div>
      <p
        className={`${
          darkMode ? "text-gray-400" : "text-gray-600"
        } text-sm mb-4`}
      >
        Your savings over time
      </p>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <div
          className="h-[300px] relative"
          ref={chartRef}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute inset-0">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={`h-${i}`}
                  className={`col-span-6 border-t border-dashed ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                ></div>
              ))}

              {/* Vertical grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`v-${i}`}
                  className={`row-span-5 border-l border-dashed ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                ></div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div
              className={`absolute left-0 top-0 h-full flex flex-col justify-between text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } py-2`}
            >
              <span>${Math.max(...savingsData.map((d) => d.value))}</span>
              <span>${Math.max(...savingsData.map((d) => d.value)) / 2}</span>
              <span>$0</span>
            </div>

            {/* X-axis labels */}
            <div
              className={`absolute bottom-0 left-10 right-0 flex justify-between text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {savingsData.map((data) => (
                <span key={data.month}>{data.month}</span>
              ))}
            </div>

            {/* Area chart */}
            <div className="absolute left-10 right-0 top-2 bottom-6">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
              >
                <path
                  d={createAreaPath()}
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="none"
                />
              </svg>

              {/* Interactive overlay */}
              <div className="absolute inset-0 flex">
                {savingsData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 h-full cursor-pointer"
                    onMouseEnter={() => setHoveredMonth(data.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  />
                ))}
              </div>

              {/* Tooltip */}
              {hoveredMonth && (
                <div
                  className={`absolute ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200"
                  } border rounded-md p-2 z-20 pointer-events-none`}
                  style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y - 60}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="font-medium">{hoveredMonth}</div>
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    savings{" "}
                    <span className="font-bold">
                      $
                      {savingsData.find((d) => d.month === hoveredMonth)?.value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetSavings;
