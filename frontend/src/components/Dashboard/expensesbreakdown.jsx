"use client"

import { useState, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import { useTheme } from "../../context/ThemeContext"

const ExpensesBreakdown = ({ data, activeIndex, setActiveIndex, totalExpenses }) => {
  const { darkMode } = useTheme()
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipData, setTooltipData] = useState(null)
  const chartRef = useRef(null)

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

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
    )
  }

  const handlePieEnter = (_, index) => {
    setActiveIndex(index)
    setShowTooltip(true)
    setTooltipData(data[index])
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
    setShowTooltip(false)
    setTooltipData(null)
  }

  return (
    <div
      className={`${darkMode ? "bg-[#111827] border-gray-800" : "bg-white border-gray-300"} p-4 rounded-lg border h-full transition-all duration-300`}
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {data.length === 0 ? (
        <p
          className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-4 transition-colors duration-300`}
        >
          No expense data available
        </p>
      ) : (
        <>
          <div className="h-[220px] mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
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
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {showTooltip && tooltipData && (
              <div
                className={`absolute ${darkMode ? "bg-[#1f2937] border-gray-700" : "bg-white border-gray-200"} border rounded-md p-3 z-20 transition-all duration-300`}
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: "translate(10px, -50%)",
                }}
              >
                <p className="font-medium text-lg" style={{ color: tooltipData.color }}>
                  {tooltipData.name}
                </p>
                <p className="text-md font-semibold">${tooltipData.value.toFixed(2)}</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-300`}>
                  {((tooltipData.value / totalExpenses) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {data.map((entry, index) => {
              const percentage = ((entry.value / totalExpenses) * 100).toFixed(1)

              return (
                <div
                  key={`legend-${index}`}
                  className={`flex items-center gap-2 cursor-pointer ${
                    darkMode ? "hover:bg-[#1f2937]" : "hover:bg-gray-50"
                  } p-1 rounded transition-all duration-300`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <div>
                    <div className="text-xs font-medium">{entry.name}</div>
                    <div
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-300`}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default ExpensesBreakdown
