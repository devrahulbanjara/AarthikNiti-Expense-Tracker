/**
 * Default color schemes for the application
 */

// Default category colors for expenses
export const expenseCategoryColors = {
  // Essentials
  "Housing": "#8b5cf6", // Purple
  "Utilities": "#6366f1", // Indigo
  "Food": "#f97316", // Orange
  "Groceries": "#f59e0b", // Amber
  "Transportation": "#84cc16", // Lime
  
  // Lifestyle
  "Entertainment": "#ec4899", // Pink
  "Shopping": "#d946ef", // Fuchsia
  "Dining Out": "#f43f5e", // Rose
  "Travel": "#0ea5e9", // Sky
  "Health": "#14b8a6", // Teal
  
  // Financial
  "Debt Payment": "#ef4444", // Red
  "Insurance": "#3b82f6", // Blue
  "Savings": "#10b981", // Emerald
  "Investments": "#22c55e", // Green
  
  // Other
  "Education": "#6b7280", // Gray
  "Gifts": "#d97706", // Amber dark
  "Charity": "#7c3aed", // Violet
  "Miscellaneous": "#94a3b8", // Slate
  "Other": "#64748b", // Slate dark
};

// Default source colors for income
export const incomeSourceColors = {
  "Salary": "#10b981", // Emerald
  "Freelance": "#22c55e", // Green
  "Business": "#16a34a", // Green dark
  "Investments": "#84cc16", // Lime
  "Rental Income": "#65a30d", // Lime dark
  "Interest": "#0ea5e9", // Sky
  "Dividends": "#0284c7", // Sky dark
  "Gifts": "#6366f1", // Indigo
  "Other": "#64748b", // Slate dark
};

/**
 * Get a color based on a string (name/category/source)
 * @param {string} str - The string to convert to a color
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {string} A hex color code
 */
export const getColorFromString = (str, isDarkMode = false) => {
  // Default palette based on mode
  const palette = isDarkMode 
    ? [
        "#4ade80", "#f87171", "#60a5fa", "#fb923c", 
        "#a78bfa", "#fbbf24", "#34d399", "#f472b6"
      ]
    : [
        "#22c55e", "#ef4444", "#3b82f6", "#f97316", 
        "#8b5cf6", "#f59e0b", "#10b981", "#ec4899"
      ];
  
  // Simple hash function to get a consistent index for a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a color from the palette
  const index = Math.abs(hash) % palette.length;
  return palette[index];
};

/**
 * Generate a linear gradient string for CSS
 * @param {string} color - The base color (hex)
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {string} CSS linear gradient
 */
export const generateGradient = (color, isDarkMode = false) => {
  if (isDarkMode) {
    return `linear-gradient(180deg, ${color}80, ${color}10)`;
  }
  return `linear-gradient(180deg, ${color}90, ${color}20)`;
};