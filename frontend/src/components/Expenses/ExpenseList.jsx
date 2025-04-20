import React, { useState } from "react";
import { Edit, Trash, Search } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const ExpenseList = ({ expenses, categoryColors, darkMode }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeleteExpense = (id) => {
    // Implement the delete logic here
  };

  return (
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } hover:shadow-md h-full`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Recent Expenses</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your expense entries
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
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"} rounded-t-lg`}>
              <th 
                className="px-4 py-2 text-left font-medium text-sm first:rounded-tl-lg"
                style={{ width: "25%" }}
              >
                Category
              </th>
              <th 
                className="px-4 py-2 text-left font-medium text-sm"
                style={{ width: "30%" }}
              >
                Description
              </th>
              <th 
                className="px-4 py-2 text-left font-medium text-sm"
                style={{ width: "15%" }}
              >
                Amount
              </th>
              <th 
                className="px-4 py-2 text-left font-medium text-sm"
                style={{ width: "15%" }}
              >
                Date
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
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center">
                  No expenses found. Add your first expense entry!
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  className={`border-b transition-colors duration-200 ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${index === filteredExpenses.length - 1 ? "last:border-0" : ""}`}
                  onMouseEnter={() => setHoveredRow(expense.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: categoryColors[expense.category] || "#f97316",
                        }}
                      />
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium">{expense.description}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-red-500">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {formatDate(expense.date)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedExpense(expense);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
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