"use client";

import { useState, useMemo, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const CategoryBreakdownChart = ({ data }) => {
  const { darkMode } = useTheme();
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [animatedData, setAnimatedData] = useState([]);

  const totalAmount = useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  const percentageData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        value: (item.amount / totalAmount) * 100,
      })),
    [data, totalAmount]
  );

  useEffect(() => {
    // Animate the chart by gradually increasing the segment values
    let animationFrame;
    const animate = () => {
      setAnimatedData((prev) => {
        if (prev.length === 0) return percentageData.map(() => 0);
        const next = prev.map((value, index) =>
          value < percentageData[index].value
            ? Math.min(value + 2, percentageData[index].value)
            : value
        );
        if (
          next.every((value, index) => value === percentageData[index].value)
        ) {
          cancelAnimationFrame(animationFrame);
        } else {
          animationFrame = requestAnimationFrame(animate);
        }
        return next;
      });
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [percentageData]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full h-[400px] flex items-center justify-center">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full max-w-[500px] mx-auto"
          style={{ overflow: "visible" }}
        >
          {/* Outer stroke */}
          <circle
            cx="80"
            cy="80"
            r="75"
            fill="none"
            stroke={darkMode ? "#374151" : "#e5e7eb"}
            strokeWidth="2"
          />

          {(() => {
            let cumulativePercent = 0;
            return animatedData.map((value, index) => {
              const startPercent = cumulativePercent;
              cumulativePercent += value;

              const startX =
                80 + 60 * Math.cos((2 * Math.PI * startPercent) / 100);
              const startY =
                80 + 60 * Math.sin((2 * Math.PI * startPercent) / 100);
              const endX =
                80 + 60 * Math.cos((2 * Math.PI * cumulativePercent) / 100);
              const endY =
                80 + 60 * Math.sin((2 * Math.PI * cumulativePercent) / 100);

              const largeArcFlag = value > 50 ? 1 : 0;

              // Position for the label
              const labelAngle =
                (2 * Math.PI * (startPercent + value / 2)) / 100;
              const labelRadius = 70;
              const labelX = 80 + labelRadius * Math.cos(labelAngle);
              const labelY = 80 + labelRadius * Math.sin(labelAngle);

              return (
                <g key={index}>
                  <path
                    d={`M 80 80 L ${startX} ${startY} A 60 60 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={percentageData[index].color}
                    opacity={hoveredSegment === index ? 0.8 : 1}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                    }}
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
                    {percentageData[index].name}
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
                    {value.toFixed(0)}%
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
                      ${percentageData[index].amount}
                    </text>
                  )}
                </g>
              );
            });
          })()}

          {/* Inner stroke */}
          <circle
            cx="80"
            cy="80"
            r="50"
            fill={darkMode ? "#1f2937" : "white"}
            stroke={darkMode ? "#374151" : "#e5e7eb"}
            strokeWidth="2"
          />

          {/* Center text showing total or hovered amount */}
          <text
            x="80"
            y="76"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={darkMode ? "white" : "black"}
            fontSize="5"
            fontWeight="bold"
          >
            $
            {hoveredSegment !== null
              ? percentageData[hoveredSegment].amount.toFixed(2)
              : totalAmount.toFixed(2)}
          </text>

          <text
            x="80"
            y="84"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={darkMode ? "gray" : "gray"}
            fontSize="3"
          >
            {hoveredSegment !== null
              ? percentageData[hoveredSegment].name
              : "Total"}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {percentageData.map((item, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer"
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm">
              {item.name}: {item.value.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;
