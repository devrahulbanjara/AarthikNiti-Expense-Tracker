"use client"

import { useState, useMemo } from "react"
import { useTheme } from "../../context/ThemeContext"

const CategoryBreakdownChart = ({ data }) => {
  const { darkMode } = useTheme()
  const [hoveredSegment, setHoveredSegment] = useState(null)
  const totalAmount = useMemo(() => data.reduce((sum, item) => sum + item.amount, 0), [data])

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full h-[350px] flex items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full max-w-[400px] mx-auto"
          style={{ overflow: "visible" }}
        >
          {(() => {
            let cumulativePercent = 0
            return data.map((item, index) => {
              const startPercent = cumulativePercent
              cumulativePercent += item.value

              const startX = 60 + 40 * Math.cos((2 * Math.PI * startPercent) / 100)
              const startY = 60 + 40 * Math.sin((2 * Math.PI * startPercent) / 100)
              const endX = 60 + 40 * Math.cos((2 * Math.PI * cumulativePercent) / 100)
              const endY = 60 + 40 * Math.sin((2 * Math.PI * cumulativePercent) / 100)

              const largeArcFlag = item.value > 50 ? 1 : 0

              // Position for the label
              const labelAngle = (2 * Math.PI * (startPercent + item.value / 2)) / 100
              const labelRadius = 55
              const labelX = 60 + labelRadius * Math.cos(labelAngle)
              const labelY = 60 + labelRadius * Math.sin(labelAngle)

              return (
                <g key={index}>
                  <path
                    d={`M 60 60 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={item.color}
                    opacity={hoveredSegment === index ? 0.8 : 1}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ cursor: "pointer" }}
                  />

                  {/* Category name label */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={darkMode ? "white" : "black"}
                    fontSize="3.5"
                    fontWeight="bold"
                  >
                    {item.name}
                  </text>

                  {/* Percentage label */}
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={darkMode ? "white" : "black"}
                    fontSize="3"
                  >
                    {item.value}%
                  </text>

                  {hoveredSegment === index && (
                    <text
                      x={labelX}
                      y={labelY + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={darkMode ? "white" : "black"}
                      fontSize="2.5"
                    >
                      ${item.amount}
                    </text>
                  )}
                </g>
              )
            })
          })()}

          <circle cx="60" cy="60" r="30" fill={darkMode ? "#1f2937" : "white"} />

          {/* center text showing total or hovered amount */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={darkMode ? "white" : "black"}
            fontSize="5"
            fontWeight="bold"
          >
            ${hoveredSegment !== null ? data[hoveredSegment].amount.toFixed(2) : totalAmount.toFixed(2)}
          </text>

          <text
            x="60"
            y="64"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={darkMode ? "gray" : "gray"}
            fontSize="3"
          >
            {hoveredSegment !== null ? data[hoveredSegment].name : "Total"}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer"
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBreakdownChart;