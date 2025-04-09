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
} from "lucide-react";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useTheme } from "../../context/ThemeContext";

const ExpenseList = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  handleSort,
  setCurrentExpense,
  setShowEditModal,
  handleDeleteExpense,
}) => {
  const { darkMode } = useTheme();
  const [hoveredRow, setHoveredRow] = useState(null);

  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoadExpenseList = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/profile/income_expense_table?transaction_type=expense&days=30`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch expense data");

      const data = await response.json();
      setExpenseList(data);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadExpenseList();
  }, []);

  console.log(expenseList);

  const filteredExpenses = expenseList.filter(
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
      className={`p-4 rounded-lg border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Expense List</h2>
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
            className={`w-full pl-10 pr-4 py-2 border rounded-md ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-black"
            }`}
          />
          <Search
            className={`absolute left-3 top-2.5 h-4 w-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              {["category", "amount", "date"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left cursor-pointer font-medium text-sm"
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
              <th className="px-4 py-2 text-left font-medium text-sm">
                Description
              </th>
              <th className="px-4 py-2 text-right font-medium text-sm">
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
                  className={`border-b ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
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
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-red-500">
                    $ {expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <Calendar
                        className={`h-4 w-4 mr-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      />
                      {new Date(expense.date).toLocaleDateString()}{" "}
                      {/* Display formatted date */}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {expense.description}
                    {expense.recurring && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {expense.recurrence_duration}
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
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete"
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
      </div>
    </div>
  );
};

export default ExpenseList;
