"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DownloadReport = () => {
  const { getToken } = useAuth();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [months, setMonths] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${BACKEND_URL}/profile/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_type: transactionType,
          months: months,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      // Get raw text and clean it by removing any markdown code block markers
      let csvContent = await res.text();

      // Remove markdown code block markers if present
      csvContent = csvContent.replace(/```csv\s*/g, "").replace(/```\s*$/g, "");

      // Trim any extra whitespace
      csvContent = csvContent.trim();

      // Create file and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${transactionType}_${months}months.csv`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsOpen(false);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } transition-all duration-200`}
      >
        <Download size={16} />
        <span>Download Report</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 p-4 rounded-md shadow-lg z-10 w-72 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3 className="font-medium mb-3">Download Transaction Report</h3>

          <div className="mb-3">
            <label className="block text-sm mb-1">Transaction Type:</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className={`w-full p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Time Period:</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className={`w-full p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value={1}>Last Month</option>
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last Year</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className={`mr-2 px-3 py-1 rounded ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className={`flex items-center space-x-1 px-3 py-1 rounded ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadReport;
