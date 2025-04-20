import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

/**
 * An enhanced animated bar chart component with ultra-smooth animations
 * @param {Object} props - Component props
 * @param {Array} props.data - Data array for the chart
 * @param {string} props.dataKey - Key in data objects to use for bar values
 * @param {string} props.xAxisKey - Key in data objects to use for x-axis
 * @param {Array} props.colors - Array of colors for bars
 * @param {Function} props.formatTooltip - Function to format tooltip values
 * @param {number} props.animationDuration - Duration of animation in ms
 */
const AnimatedBarChart = ({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  colors = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6'],
  formatTooltip = (value) => `$${value.toLocaleString()}`,
  animationDuration = 1500,
  labelKey,
  height = 300,
  showGrid = false
}) => {
  const { darkMode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [animationStage, setAnimationStage] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  // Enhanced animation setup with multiple stages
  useEffect(() => {
    if (data.length > 0) {
      // Reset animation state
      setAnimationStage(0);
      startTimeRef.current = null;
      
      // Start with zero values
      const initialData = data.map(item => ({
        ...item,
        [dataKey]: 0,
        _opacity: 0
      }));
      
      setChartData(initialData);
      
      // Stage 1: Fade in bars (20% of total animation time)
      setTimeout(() => {
        const fadeInData = data.map((item, index) => ({
          ...item,
          [dataKey]: 0,
          _opacity: 1,
          _delay: index * 60 // Stagger the appearance
        }));
        setChartData(fadeInData);
        setAnimationStage(1);
      }, 50);
      
      // Stage 2: Grow bars with staggered timing (80% of total animation time)
      setTimeout(() => {
        // Apply staggered animation timing for each bar
        const finalData = data.map((item, index) => {
          const growDelay = index * 100; // Stagger the growth
          return {
            ...item,
            _opacity: 1,
            _delay: growDelay
          };
        });
        setChartData(finalData);
        setAnimationStage(2);
      }, 250);
    } else {
      setChartData([]);
    }
  }, [data, dataKey]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 border rounded-lg shadow-md transform transition-all duration-300 
          ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}
          scale-100 opacity-100`}
        >
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center mt-1 transition-all duration-300">
              <div 
                className="w-3 h-3 rounded-full mr-2 transition-all duration-300" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2">
                {labelKey && entry.payload[labelKey] ? entry.payload[labelKey] : entry.name}:
              </span>
              <span className="font-medium">
                {formatTooltip(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Custom animation for bars
  const CustomizedBar = (props) => {
    const { x, y, width, height, fill, dataKey, payload, index } = props;
    const barHeight = animationStage === 2 ? height : 0;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          rx={4}
          ry={4}
          height={barHeight}
          fill={fill}
          fillOpacity={activeIndex === index ? 1 : 0.8}
          className="transition-all duration-300"
          style={{
            transformOrigin: 'bottom',
            transition: `height ${animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${payload._delay || 0}ms, 
                         opacity ${300}ms ease-out ${payload._delay || 0}ms`,
            opacity: payload._opacity !== undefined ? payload._opacity : 1
          }}
        />
        <rect
          x={x}
          y={y + barHeight - 2}
          width={width}
          height={2}
          rx={1}
          fill={fill}
          fillOpacity={1}
          style={{
            filter: `drop-shadow(0 0 2px ${fill})`,
            transition: `opacity ${300}ms ease-out ${(payload._delay || 0) + 200}ms`,
            opacity: payload._opacity !== undefined ? payload._opacity : 1
          }}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis 
          dataKey={xAxisKey} 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
          tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
          dx={-10}
        />
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#e5e7eb'} />}
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ 
            fill: darkMode ? 'rgba(75, 85, 99, 0.1)' : 'rgba(229, 231, 235, 0.3)',
            radius: 4
          }} 
          animationDuration={300}
          animationEasing="ease-out"
        />
        <Bar 
          dataKey={dataKey} 
          radius={[4, 4, 0, 0]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          minPointSize={2}
          shape={<CustomizedBar />}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnimatedBarChart; 