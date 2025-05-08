"use client";

import React, { useState, useEffect } from "react";
import { Download, Loader2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DownloadReport = () => {
  const { getToken } = useAuth();
  const { darkMode } = useTheme();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const [months, setMonths] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsModalVisible(true);
    } else {
      const timer = setTimeout(() => setIsModalVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
          currency: currency,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      let csvContent = await res.text();
      csvContent = csvContent.replace(/```csv\s*/g, "").replace(/```\s*$/g, "");
      csvContent = csvContent.trim();

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${transactionType}_${months}months_${currency}.csv`;
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

  const closeModal = () => {
    setIsOpen(false);
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

      {isModalVisible && (
        <div
          className={`absolute right-0 mt-2 p-4 rounded-md shadow-lg hover:shadow-xl z-10 w-72 transform transition-all duration-300 ease-out ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <button
            onClick={closeModal}
            className={`absolute top-2 right-2 p-1 rounded-full ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            } transition-colors`}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <h3 className="font-medium mb-3 text-lg">Download Report</h3>

          <div className="text-sm mb-3">
            <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Current currency: <span className="font-medium">{currency}</span>
            </span>
          </div>

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

          <div className="flex justify-end mt-4">
            <button
              onClick={handleDownload}
              disabled={loading}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } transition-all duration-200`}
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
