import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedCounter from '../UI/AnimatedCounter';

const IncomeBreakdown = ({ sources = [], totalIncome = 0, title = "Income Breakdown" }) => {
  const { darkMode } = useTheme();
  const [sortedSources, setSortedSources] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sort sources by amount in descending order and add percentage
    if (sources.length > 0 && totalIncome > 0) {
      const processed = sources
        .map(source => ({
          ...source,
          percentage: (source.amount / totalIncome) * 100
        }))
        .sort((a, b) => b.amount - a.amount);
      
      setSortedSources(processed);
      
      // Trigger animation after a short delay
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [sources, totalIncome]);

  return (
    <div className={`p-4 lg:p-6 rounded-lg border transition-all duration-300 ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    } hover:shadow-md h-full`}>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Your income distribution
      </p>
      
      {sortedSources.length === 0 ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No data available
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSources.map((source, index) => (
            <div key={source.name || index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {source.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <AnimatedCounter 
                      value={source.percentage} 
                      suffix="%" 
                      decimals={1}
                      duration={1200 + index * 100} 
                    />
                  </span>
                  <span className={`font-semibold text-green-500`}>
                    <AnimatedCounter 
                      value={source.amount} 
                      prefix="$" 
                      decimals={2}
                      duration={1200 + index * 100} 
                    />
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-green-500"
                  style={{ 
                    width: isVisible ? `${source.percentage}%` : '0%',
                    opacity: darkMode ? 0.8 : 0.7,
                    transition: `width ${1000 + index * 100}ms ease-out ${index * 50}ms`
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Total row with separator */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Total Income
              </span>
              <span className={`font-bold text-lg text-green-500`}>
                <AnimatedCounter 
                  value={totalIncome} 
                  prefix="$" 
                  decimals={2}
                  duration={1800} 
                />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeBreakdown; 