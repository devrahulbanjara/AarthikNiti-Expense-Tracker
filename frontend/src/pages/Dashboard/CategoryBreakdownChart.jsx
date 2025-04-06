"use client"

import { useState } from "react";

const CategoryBreakdownChart = ({ darkMode, data }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative w-80 h-80">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {(() => {
            let cumulativePercent = 0;
            return data.map((item, index) => {
              const startPercent = cumulativePercent;
              cumulativePercent += item.value;

              const startX = 50 + 40 * Math.cos((2 * Math.PI * startPercent) / 100);
              const startY = 50 + 40 * Math.sin((2 * Math.PI * startPercent) / 100);
              const endX = 50 + 40 * Math.cos((2 * Math.PI * cumulativePercent) / 100);
              const endY = 50 + 40 * Math.sin((2 * Math.PI * cumulativePercent) / 100);

              const largeArcFlag = item.value > 50 ? 1 : 0;

              // Position for the label
              const labelAngle = (2 * Math.PI * (startPercent + item.value / 2)) / 100;
              const labelRadius = 70;
              const labelX = 50 + labelRadius * Math.cos(labelAngle);
              const labelY = 50 + labelRadius * Math.sin(labelAngle);

              // Position for the percentage
              const percentRadius = 55;
              const percentX = 50 + percentRadius * Math.cos(labelAngle);
              const percentY = 50 + percentRadius * Math.sin(labelAngle);

              return (
                <g key={index}>
                  <path
                    d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
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
                    x={percentX}
                    y={percentY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={darkMode ? "white" : "black"}
                    fontSize="3.5"
                  >
                    {item.value}%
                  </text>

                  {hoveredSegment === index && (
                    <text
                      x={labelX}
                      y={labelY + 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={darkMode ? "white" : "black"}
                      fontSize="3"
                    >
                      ${item.amount}
                    </text>
                  )}
                </g>
              );
            });
          })()}

          <circle cx="50" cy="50" r="30" fill={darkMode ? "#1f2937" : "white"} />
          
          {/* center text showing total or hovered amount */}
          <text
            x="50"
            y="46"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={darkMode ? "white" : "black"}
            fontSize="5"
            fontWeight="bold"
          >
            ${hoveredSegment !== null ? data[hoveredSegment].amount.toFixed(2) : totalAmount.toFixed(2)}
          </text>
          
          <text
            x="50"
            y="54"
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
            <span className="text-sm">{item.name}: {item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;