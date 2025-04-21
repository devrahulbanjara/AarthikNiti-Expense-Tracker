"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Loader,
} from "lucide-react";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExpenseList = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  handleSort,
  setCurrentExpense,
  setShowEditModal,
  handleDeleteExpense,
  timeRange,
  loading,
  expenseList,
  refreshExpenses,
}) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [hoveredRow, setHoveredRow] = useState(null);

  // Use props for loading and expenseList when provided
  const [localExpenseList, setLocalExpenseList] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  // If props are provided, use them; otherwise, use local state
  const isLoading = loading !== undefined ? loading : localLoading;
  const expenses = expenseList || localExpenseList;

  const handleLoadExpenseList = async () => {
    if (refreshExpenses) {
      refreshExpenses();
      return;
    }

    setLocalLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${BACKEND_URL}/profile/income_expense_table?transaction_type=expense&days=30`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch expense data");

      const data = await response.json();
      console.log("Raw expense data:", data);

      // Transform the data to match the expected format
      const transformedData = data.map((expense) => ({
        ...expense,
        amount: parseFloat(expense.amount),
        isRecurring: expense.recurring || false,
        recurringPeriod: expense.recurrence_duration || null,
      }));

      console.log("Transformed expense data:", transformedData);
      setLocalExpenseList(transformedData);
    } catch (error) {
      console.error("Error fetching expense data:", error);
      setLocalExpenseList([]);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    // Only load if expenseList prop is not provided
    if (!expenseList) {
      handleLoadExpenseList();
    }
  }, [getToken, expenseList]);

  const filteredExpenses = expenses.filter(
    (expense) =>
      !searchTerm ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === "amount")
      return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
    if (key === "date")
      return direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    if (key === "category")
      return direction === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    return 0;
  });

  return (
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } hover:shadow-md h-full`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Expense List</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your expenses
          </p>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors duration-200 
              ${darkMode 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-green-500 focus:border-green-500"}
              focus:outline-none focus:ring-2`}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="h-8 w-8 animate-spin text-primary-500" />
            <span className="ml-2">Loading expenses...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"} rounded-t-lg`}>
                {["category", "amount", "date"].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left cursor-pointer font-medium text-sm first:rounded-tl-lg"
                    style={{
                      width:
                        header === "category"
                          ? "20%"
                          : header === "amount"
                          ? "15%"
                          : "20%",
                    }}
                    onClick={() => handleSort(header)}
                  >
                    <div className="flex items-center">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                      {sortConfig.key === header &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                ))}
                <th
                  className="px-4 py-2 text-left font-medium text-sm"
                  style={{ width: "30%" }}
                >
                  Description
                </th>
                <th
                  className="px-4 py-2 text-right font-medium text-sm last:rounded-tr-lg"
                  style={{ width: "15%" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center">
                    No expenses found. Add your first expense!
                  </td>
                </tr>
              ) : (
                sortedExpenses.map((expense, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors duration-200 ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700/50"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${index === sortedExpenses.length - 1 ? "last:border-0" : ""}`}
                    onMouseEnter={() => setHoveredRow(expense.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              expenseCategories.find(
                                (cat) => cat.name === expense.category
                              )?.color || "#ccc",
                          }}
                        />
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                          {expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-red-500 font-medium">
                      $ {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar
                          className={`h-4 w-4 mr-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {expense.description}
                      {expense.recurring && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {expense.recurrence_duration ? expense.recurrence_duration.charAt(0).toUpperCase() + expense.recurrence_duration.slice(1) : "Recurring"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentExpense(expense);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Edit"
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteExpense(expense.transaction_id)
                          }
                          className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          title="Delete"
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
