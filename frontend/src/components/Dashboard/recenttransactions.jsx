"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUp, ArrowDown, Trash } from "lucide-react";
import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RecentTransactions = ({ onTransactionsChange }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const fetchTransactionsData = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${BACKEND_URL}/profile/recent_transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

      setTransactions(formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/transaction/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions(transactions.filter((t) => t.id !== id));
      onTransactionsChange(); // Re-fetch dashboard data after deletion
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    return (
      !searchTerm ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        hover:shadow-md h-full`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Recent Transactions</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Your latest financial activity
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm transition-colors duration-200 
              ${darkMode 
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-green-500 focus:border-green-500"}
              focus:outline-none focus:ring-2`}
          />
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
              ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading transactions...</span>
        </div>
      ) : displayTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No transactions found matching your criteria.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {displayTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg transition-all duration-200 
              ${darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center mb-2 sm:mb-0 flex-grow">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full mr-3 flex-shrink-0 
                    ${transaction.type === "income"
                      ? (darkMode ? "bg-green-900/50" : "bg-green-100")
                      : (darkMode ? "bg-red-900/50" : "bg-red-100")}`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUp className={`h-5 w-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                  ) : (
                    <ArrowDown className={`h-5 w-5 ${darkMode ? "text-red-400" : "text-red-600"}`} />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-sm break-words">{transaction.description}</div>
                  <div className="flex items-center mt-1 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full mr-2 whitespace-nowrap 
                        ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
                    >
                      {transaction.category}
                    </span>
                    <span className={`text-xs whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                <div
                  className={`text-sm font-semibold whitespace-nowrap 
                    ${transaction.type === "income"
                      ? (darkMode ? "text-green-400" : "text-green-600")
                      : (darkMode ? "text-red-400" : "text-red-600")}`}
                >
                  {transaction.type === "income" ? "+" : "-"} $
                  {transaction.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className={`p-1.5 rounded-full transition-colors duration-200 
                    ${darkMode 
                      ? "text-gray-400 hover:bg-red-900/50 hover:text-red-400" 
                      : "text-gray-500 hover:bg-red-100 hover:text-red-600"}`}
                  aria-label="Delete transaction"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {filteredTransactions.length > 5 && (
        <div className="mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
          <button
            className={`w-full text-center py-2 px-4 text-sm rounded-lg transition-colors duration-200 
              ${darkMode 
                ? "bg-gray-700 hover:bg-gray-600 text-blue-400" 
                : "bg-gray-100 hover:bg-gray-200 text-blue-600"}`}
            onClick={() => setShowAllTransactions(!showAllTransactions)}
          >
            {showAllTransactions ? "Show Less" : "View All Transactions"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
