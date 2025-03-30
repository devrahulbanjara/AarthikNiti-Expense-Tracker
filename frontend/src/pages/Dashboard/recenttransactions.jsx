"use client";

import {
  Search,
  Filter,
  Edit,
  Trash,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const RecentTransactions = ({
  transactions,
  searchTerm,
  setSearchTerm,
  showAll,
  setShowAll,
  onAdd,
  onEdit,
  onDelete,
  filters,
  handleFilterChange,
  resetFilters,
  showFilters,
  setShowFilters,
  darkMode,
  expenseCategories,
}) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } h-full`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your recent financial activity
            </p>
          </div>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center cursor-pointer hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </button>
        </div>

        <div className="flex gap-2 mt-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search transactions..."
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-black"
            } rounded-md text-sm flex items-center cursor-pointer`}
          >
            <Filter className="h-4 w-4 mr-1" /> Filter
          </button>
        </div>

        {showFilters && (
          <div
            className={`mb-4 p-3 border rounded-md ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-blue-500 text-sm cursor-pointer hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <option value="">All Categories</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Gifts">Gifts</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={filters.description}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black"
                  }`}
                  placeholder="Filter by description"
                />
              </div>
              <div>
                <label
                  className={`block text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  To Date
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {displayTransactions.length === 0 ? (
          <p
            className={`text-center ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } py-4`}
          >
            No transactions found
          </p>
        ) : (
          <ul className="space-y-2">
            {displayTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`flex justify-between py-3 px-2 rounded-md ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    } mr-3`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-0.5 ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        } rounded-full mr-2`}
                      >
                        {transaction.category}
                      </span>
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div
                      className={
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500 font-medium"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-gray-500 hover:text-blue-500"
                      } cursor-pointer`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-red-400"
                          : "text-gray-500 hover:text-red-500"
                      } cursor-pointer`}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {transactions.length > 5 && (
          <button
            className={`w-full text-center py-3 mt-4 border ${
              darkMode
                ? "border-gray-700 text-blue-400 hover:bg-gray-700"
                : "border-gray-200 text-blue-500 hover:bg-gray-50"
            } rounded-md cursor-pointer`}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All Transactions"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
