/**
 * Formats a date string into a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date (e.g., "Jan 15, 2023")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Gets the current month name
 * @returns {string} Current month name (e.g., "January")
 */
export const getCurrentMonth = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'long' });
};

/**
 * Formats a date as YYYY-MM-DD for input fields
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date as YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets a formatted date range for the current month
 * @returns {Object} Object with startDate and endDate strings
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate)
  };
};

/**
 * Gets the last N months as an array of objects with month name and value
 * @param {number} count - Number of months to return
 * @returns {Array} Array of objects with name and value properties
 */
export const getLastMonths = (count = 6) => {
  const months = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    months.push({
      name: monthName,
      value: monthValue
    });
  }
  
  return months;
}; 