import { useState, useEffect, useRef } from "react";

const NetSavings = ({ darkMode }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [savingsData, setSavingsData] = useState([]);
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/profile/net-saving-trend?n=${timeRange === "Last 3 months" ? 3 : timeRange === "Last 6 months" ? 6 : 12}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch savings data");

        const data = await response.json();

        const formattedData = data.savings_trend.map(({ year, month, savings }) => ({
          month: new Date(year, month - 1).toLocaleString("default", { month: "short" }),
          value: savings,
        }));

        setSavingsData(formattedData);
      } catch (error) {
        console.error("Error fetching savings data:", error);
        setSavingsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const chartWidth = 100;
  const chartHeight = 100;
  const points = savingsData.map((data, index) => ({
    x: (index / (savingsData.length - 1)) * chartWidth,
    y: chartHeight - (data.value / Math.max(...savingsData.map((d) => d.value))) * chartHeight,
    ...data,
  }));

  const createAreaPath = () => {
    if (points.length === 0) return "";

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const { x: prevX, y: prevY } = points[i - 1];
      const { x: currX, y: currY } = points[i];
      const cp1x = prevX + (currX - prevX) / 3;
      const cp1y = prevY;
      const cp2x = prevX + (2 * (currX - prevX)) / 3;
      const cp2y = currY;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${currX},${currY}`;
    }
    path += ` L${points[points.length - 1].x},${chartHeight} L${points[0].x},${chartHeight} Z`;
    return path;
  };

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Net Savings Trend</h2>
        <select
          className={`text-sm border rounded-md px-2 py-1 cursor-pointer ${darkMode ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : "bg-white border-gray-300 hover:bg-gray-50"}`}
          onChange={(e) => setTimeRange(e.target.value)}
          value={timeRange}
        >
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>Your savings over time</p>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading savings data...</span>
        </div>
      ) : savingsData.length === 0 ? (
        <div className="flex justify-center items-center h-[300px]">
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No savings data available</p>
        </div>
      ) : (
        <div className="h-[300px] relative" ref={chartRef} onMouseMove={handleMouseMove}>
          <div className="absolute inset-0">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
              {[...Array(5)].map((_, i) => (
                <div key={`h-${i}`} className={`col-span-6 border-t border-dashed ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              ))}
              {[...Array(6)].map((_, i) => (
                                <div key={`v-${i}`} className={`row-span-5 border-l border-dashed ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              ))}
            </div>

            <div className={`absolute left-0 top-0 h-full flex flex-col justify-between text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} py-2`}>
              <span>${Math.max(...savingsData.map((d) => d.value))}</span>
              <span>${Math.max(...savingsData.map((d) => d.value)) / 2}</span>
              <span>$0</span>
            </div>

            <div className={`absolute bottom-0 left-10 right-0 flex justify-between text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {savingsData.map((data) => (
                <span key={data.month}>{data.month}</span>
              ))}
            </div>

            <div className="absolute left-10 right-0 top-2 bottom-6">
              <svg width="100%" height="100%" viewBox={`0 0 ${100} ${100}`} preserveAspectRatio="none">
                <path d={createAreaPath()} fill="rgba(59, 130, 246, 0.3)" stroke="none" />
              </svg>

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

              {hoveredMonth && (
                <div
                  className={`absolute ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border rounded-md p-2 z-20 pointer-events-none`}
                  style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y - 60}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="font-medium">{hoveredMonth}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    savings <span className="font-bold">${savingsData.find((d) => d.month === hoveredMonth)?.value}</span>
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