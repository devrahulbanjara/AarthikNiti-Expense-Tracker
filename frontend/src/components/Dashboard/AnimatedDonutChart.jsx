import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import AnimatedCounter from '../UI/AnimatedCounter';

/**
 * An animated donut chart component with smooth transitions
 * @param {Object} props - Component props
 * @param {Array} props.data - Data array for the chart
 * @param {string} props.dataKey - Key in data objects to use for pie values
 * @param {string} props.nameKey - Key in data objects to use for segment names
 * @param {Array} props.colors - Array of colors for segments
 * @param {number} props.innerRadius - Inner radius of the donut (0-100)
 * @param {number} props.outerRadius - Outer radius of the donut (0-100)
 * @param {Function} props.formatTooltip - Function to format tooltip values
 */
const AnimatedDonutChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = ['#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'],
  innerRadius = 60,
  outerRadius = 80,
  formatTooltip = (value) => `$${value.toLocaleString()}`,
  height = 300,
  centerLabel = null,
  startAnimation = true
}) => {
  const { darkMode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  // Animation setup with staggered reveal
  useEffect(() => {
    if (data.length > 0 && startAnimation) {
      // Calculate total for percentage later
      const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
      setTotalValue(total);
      
      // Start with all segments at 0
      const initialData = data.map(item => ({
        ...item,
        _animValue: 0
      }));
      setChartData(initialData);
      
      // Animate each segment one by one with smooth transitions
      let timer;
      let currentIndex = 0;
      
      const animateNextSegment = () => {
        if (currentIndex >= data.length) {
          setAnimationComplete(true);
          return;
        }
        
        const newData = [...chartData];
        newData[currentIndex] = {
          ...newData[currentIndex],
          _animValue: data[currentIndex][dataKey]
        };
        
        setChartData(newData);
        currentIndex++;
        
        // Schedule next segment animation
        timer = setTimeout(animateNextSegment, 150);
      };
      
      // Start the animation sequence
      timer = setTimeout(animateNextSegment, 300);
      
      return () => clearTimeout(timer);
    } else if (data.length > 0) {
      // No animation, just show data
      const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
      setTotalValue(total);
      
      const preparedData = data.map(item => ({
        ...item,
        _animValue: item[dataKey]
      }));
      setChartData(preparedData);
      setAnimationComplete(true);
    } else {
      setChartData([]);
      setTotalValue(0);
    }
  }, [data, dataKey, startAnimation]);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  // Animated active shape when hovering over a segment
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name, value, percent } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-300"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          className="transition-all duration-300"
        />
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, fill, percent } = payload[0];
      return (
        <div className={`p-3 border rounded-lg shadow-md transform transition-all duration-200 
          ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}
          scale-100 opacity-100`}
        >
          <div className="flex items-center mb-1">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: fill }}
            />
            <span className="font-semibold">{name}</span>
          </div>
          <div className="mt-1">
            <div className="text-sm">
              {formatTooltip(value)} ({(percent * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Center label or total
  const CenterLabel = () => {
    if (!centerLabel && (!totalValue || !animationComplete)) return null;
    
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle"
        className={`${darkMode ? 'fill-white' : 'fill-gray-800'} transition-all duration-500`}
      >
        {centerLabel ? (
          <>
            <tspan 
              x="50%" 
              dy="-1.2em" 
              fontSize="14" 
              fontWeight="normal"
              className={`${darkMode ? 'fill-gray-300' : 'fill-gray-500'}`}
            >
              Total
            </tspan>
            <tspan x="50%" dy="1.4em" fontSize="16" fontWeight="bold">
              <AnimatedCounter 
                value={totalValue} 
                prefix="$" 
                decimals={0}
                duration={1500}
                delay={data.length * 150 + 300}
              />
            </tspan>
          </>
        ) : (
          <tspan fontSize="14" fontWeight="normal">
            {centerLabel}
          </tspan>
        )}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="_animValue"
          nameKey={nameKey}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          paddingAngle={2}
          startAngle={90}
          endAngle={-270}
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
              className="transition-all duration-300"
              stroke={darkMode ? '#1f2937' : '#ffffff'}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {(centerLabel || totalValue > 0) && <CenterLabel />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AnimatedDonutChart; 