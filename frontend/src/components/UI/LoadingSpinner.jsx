import React from 'react';
import { useTheme } from "../../context/ThemeContext";

/**
 * A reusable loading spinner component that adapts to dark mode
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color override for the spinner
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.fullPage - Whether to display the spinner centered on the full page
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color, 
  text = 'Loading...', 
  fullPage = false 
}) => {
  const { darkMode } = useTheme();
  
  // Determine size class
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  // Determine spinner color
  const spinnerColor = color || (darkMode ? '#4ade80' : '#10b981');
  
  // Component for the spinner itself
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{ 
          borderColor: `${spinnerColor}40`,
          borderTopColor: spinnerColor
        }}
      ></div>
      {text && (
        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
  
  // If fullPage, center in viewport
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        <Spinner />
      </div>
    );
  }
  
  // Default centered in its container
  return <Spinner />;
};

export default LoadingSpinner; 