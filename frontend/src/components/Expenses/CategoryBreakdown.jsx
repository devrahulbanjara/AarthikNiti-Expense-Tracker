import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedCounter from '../UI/AnimatedCounter';

const CategoryBreakdown = ({ categories = [], totalSpending = 0, title = "Expense Breakdown" }) => {
  const { darkMode } = useTheme();
  const [sortedCategories, setSortedCategories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sort categories by amount in descending order and add percentage
    if (categories.length > 0 && totalSpending > 0) {
      const processed = categories
        .map(cat => ({
          ...cat,
          percentage: (cat.amount / totalSpending) * 100
        }))
        .sort((a, b) => b.amount - a.amount);
      
      setSortedCategories(processed);
      
      // Trigger animation after a short delay
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [categories, totalSpending]);

  return (
    <div className={`p-4 lg:p-6 rounded-lg border transition-all duration-300 ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    } hover:shadow-md h-full`}>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        How your money is distributed
      </p>
      
      {sortedCategories.length === 0 ? (
        <div className="flex justify-center items-center h-[200px]">
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No data available
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map((category, index) => (
            <div key={category.name || index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <AnimatedCounter 
                      value={category.percentage} 
                      suffix="%" 
                      decimals={1}
                      duration={1200 + index * 100} 
                    />
                  </span>
                  <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    <AnimatedCounter 
                      value={category.amount} 
                      prefix="$" 
                      decimals={2}
                      duration={1200 + index * 100} 
                    />
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: isVisible ? `${category.percentage}%` : '0%',
                    backgroundColor: category.color,
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
                Total
              </span>
              <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                <AnimatedCounter 
                  value={totalSpending} 
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

export default CategoryBreakdown; 