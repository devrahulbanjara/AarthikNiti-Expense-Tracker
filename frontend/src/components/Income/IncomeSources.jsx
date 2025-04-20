"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { incomeSources } from "../../pages/Dashboard/incomeSources";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const IncomeSources = ({ onEdit, onDelete, formatDate }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleLoadIncomeList = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${BACKEND_URL}/profile/income_expense_table?transaction_type=income&days=30`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch income data");

      const data = await response.json();
      // Transform the data to match the expected format
      const transformedData = data.map((item) => ({
        ...item,
        amount: parseFloat(item.amount),
        date: formatDate(item.date),
      }));
      setIncomeList(transformedData);
    } catch (error) {
      console.error("Error fetching income data:", error);
      setIncomeList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        const token = getToken();
        const response = await fetch(`${BACKEND_URL}/profile/delete_income`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ transaction_id: transactionId }),
        });

        if (!response.ok) throw new Error("Failed to delete income");

        // Refresh the income list
        handleLoadIncomeList();
      } catch (error) {
        console.error("Error deleting income:", error);
        alert("Failed to delete income. Please try again.");
      }
    }
  };

  useEffect(() => {
    handleLoadIncomeList();
  }, [getToken, formatDate]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const filteredIncomes = incomeList.filter(
    (income) =>
      !searchTerm ||
      income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
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
          <h2 className="text-xl font-semibold mb-1">Income Sources</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Manage your income sources
          </p>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search income..."
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
              {["source", "amount", "date"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left cursor-pointer font-medium text-sm first:rounded-tl-lg"
                  style={{
                    width:
                      header === "source"
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
            {sortedIncomes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center">
                  No income sources found. Add your first income!
                </td>
              </tr>
            ) : (
              sortedIncomes.map((income, index) => (
                <tr
                  key={index}
                  className={`border-b transition-colors duration-200 ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${index === sortedIncomes.length - 1 ? "last:border-0" : ""}`}
                  onMouseEnter={() => setHoveredRow(income.transaction_id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            incomeSources.find(
                              (source) => source.name === income.category
                            )?.color || "#94a3b8",
                        }}
                      />
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                        {income.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-green-600 font-medium">
                    $ {income.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <Calendar
                        className={`h-4 w-4 mr-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      />
                      {new Date(income.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {income.description}
                    {income.recurring && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {income.recurrence_duration}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(income)}
                        className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(income.transaction_id)}
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

export default IncomeSources;
