import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AnimatedCounter from '../UI/AnimatedCounter';

/**
 * A visually appealing expense summary component
 * @param {Object} props - Component props
 * @param {number} props.totalSpending - Total spending amount
 * @param {number} props.previousPeriodSpending - Previous period spending for comparison
 * @param {string} props.period - Period label (e.g., "This Month")
 */
const ExpenseSummary = ({ 
  totalSpending = 0, 
  previousPeriodSpending = 0,
  period = "This Month",
  onClick
}) => {
  const { darkMode } = useTheme();
  
  // Calculate percentage change
  const percentChange = previousPeriodSpending > 0 
    ? ((totalSpending - previousPeriodSpending) / previousPeriodSpending) * 100
    : 0;
  
  // Determine if spending increased or decreased
  const increased = percentChange > 0;
  const changeText = increased 
    ? `${Math.abs(percentChange).toFixed(1)}% increase` 
    : percentChange < 0 
      ? `${Math.abs(percentChange).toFixed(1)}% decrease` 
      : 'No change';
  
  return (
    <div 
      className={`p-6 rounded-lg border transition-all duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } hover:shadow-md cursor-pointer transform hover:scale-[1.01] h-full`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <h3 className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Total Expenses
            </h3>
            <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}>
              {period}
            </span>
          </div>
          
          <div className="mt-6 mb-2">
            <span className="text-3xl font-bold text-red-500">
              $<AnimatedCounter 
                value={totalSpending} 
                decimals={2}
                duration={2000}
              />
            </span>
          </div>
          
          {previousPeriodSpending > 0 && (
            <div className={`flex items-center text-sm ${
              increased ? 'text-red-500' : percentChange < 0 ? 'text-green-500' : 'text-gray-500'
            }`}>
              {increased ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : percentChange < 0 ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : null}
              <span>{changeText} from previous {period.toLowerCase()}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${
          darkMode ? "bg-red-500/10" : "bg-red-100"
        }`}>
          <DollarSign className="h-6 w-6 text-red-500" />
        </div>
      </div>
      
      {totalSpending > 0 && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-red-500 transition-all duration-1000 ease-out"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary; 