"use client";

import { useState, useEffect } from "react";
import { Search, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const IncomeSources = ({ incomeSources, onEdit, onDelete, formatDate }) => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/profile/income_expense_table?transaction_type=income&days=30`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incomes");
        }

        const data = await response.json();
        console.log("Income table data:", data);

        const formattedIncomes = data.map((income, index) => ({
          id: index + 1,
          source: income.category,
          amount: income.amount,
          date: income.date,
          description: income.description,
        }));

        setIncomes(formattedIncomes);

        const total = formattedIncomes.reduce((sum, income) => sum + income.amount, 0);
        setTotalIncome(total);
      } catch (error) {
        console.error("Error fetching incomes:", error);
        setIncomes([]);
        setTotalIncome(0);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Filter incomes based on search
  const filteredIncomes = incomes.filter(
    (income) =>
      !searchTerm ||
      income.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort incomes based on sortConfig
  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === "amount") {
      return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    if ( key === "date") {
      return direction === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    }
    if (key === "source") {
      return direction === "asc" ? a.source.localeCompare(b.source) : b.source.localeCompare(a.source);
    }
    return 0;
  });

  // Safe date formatter that handles invalid dates
  const safeFormatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDate(dateString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-[#111827]" : "bg-white"} rounded-lg border ${
        darkMode ? "border-gray-800" : "border-gray-200"
      } transition-colors duration-300`}
    >
      <div className={`p-4 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div>
          <h2 className="text-xl font-bold">Income Sources</h2>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
          Manage and track all your income sources
        </p>
      </div>

      {/* Search */}
      <div className={`p-4 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search income sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr 4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#1f2937] border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Income List */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-2">Loading income data...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead
              className={`${darkMode ? "bg-[#1f2937]" : "bg-gray-50"} border-b ${
                darkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("source")}
                >
                  <div className="flex items-center">
                    Source
                    {sortConfig.key === "source" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {sortConfig.key === "amount" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "date" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-200"}`}>
              {sortedIncomes.length > 0 ? (
                sortedIncomes.map((income) => (
                  <tr
                    key={income.id}
                    className={`${darkMode ? "hover:bg-[#1f2937]" : "hover:bg-gray-50"} transition-colors duration-300`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: incomeSources.find((s) => s.name === income.source)?.color || "#6b7280",
                          }}
                        ></div>
                        <span>{income.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-500 font-medium">
                      +${income.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{income.description || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{safeFormatDate(income.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(income)}
                        className="text-[#065336] hover:text-[#054328] dark:text-[#2a9d6e] dark:hover:text-[#3cb485] mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(income.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No income sources found. Add your first income source!
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot
              className={`${darkMode ? "bg-[#1f2937]" : "bg-gray-50"} border-t ${
                darkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <tr>
                <td className="px-6 py-3 text-left font-bold">Total</td>
                <td className="px-6 py-3 text-left font-bold text-green-500">+${totalIncome.toFixed(2)}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncomeSources;