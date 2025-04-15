"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useTheme } from "../../context/ThemeContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RecentTransactions = ({ onTransactionsChange }) => {
  const { darkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchTransactionsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/profile/recent_transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      console.log("Recent Transactions Data from Backend:", data);

      const formattedTransactions = data.map((transaction) => ({
        id: transaction._id,
        type: transaction.transaction_type,
        amount: transaction.transaction_amount,
        category: transaction.transaction_category,
        description: transaction.transaction_description,
        date: new Date(transaction.timestamp).toISOString().split("T")[0],
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () =>
    setFilters({ category: "", dateFrom: "", dateTo: "", description: "" });

  const filteredTransactions = transactions.filter((t) => {
    return (
      (!searchTerm ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.dateFrom || new Date(filters.dateFrom) <= new Date(t.date)) &&
      (!filters.dateTo || new Date(filters.dateTo) >= new Date(t.date)) &&
      (!filters.description ||
        t.description.toLowerCase().includes(filters.description.toLowerCase()))
    );
  });

  useEffect(() => {
    fetchTransactionsData();
    const intervalId = setInterval(fetchTransactionsData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const displayTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, 5);

  return (
    <>
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-4 rounded-lg border ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } h-full -ml-6`}
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
                {["category", "description", "dateFrom", "dateTo"].map(
                  (filter, index) => (
                    <div key={index}>
                      <label
                        className={`block text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        } mb-1`}
                      >
                        {filter.charAt(0).toUpperCase() +
                          filter.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      {filter === "category" ? (
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
                        </select>
                      ) : (
                        <input
                          type={filter.includes("date") ? "date" : "text"}
                          name={filter}
                          value={filters[filter]}
                          onChange={handleFilterChange}
                          className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                            darkMode
                              ? "bg-gray-800 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-black"
                          }`}
                          placeholder={
                            filter === "description"
                              ? "Filter by description"
                              : ""
                          }
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : displayTransactions.length === 0 ? (
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
                      <div className="font-medium">
                        {transaction.description}
                      </div>
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
                    <div
                      className={`text-right ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500 font-medium"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className={`cursor-pointer ${
                          darkMode
                            ? "text-gray-400 hover:text-red-400"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filteredTransactions.length > 5 && (
            <button
              className={`w-full text-center py-3 mt-4 border ${
                darkMode
                  ? "border-gray-700 text-blue-400 hover:bg-gray-700"
                  : "border-gray-200 text-blue-500 hover:bg-gray-50"
              } rounded-md cursor-pointer`}
              onClick={() => setShowAllTransactions(!showAllTransactions)}
            >
              {showAllTransactions ? "Show Less" : "View All Transactions"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;
