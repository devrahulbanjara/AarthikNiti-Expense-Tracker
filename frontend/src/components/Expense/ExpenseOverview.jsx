"use client";

import DailyExpensesChart from "./DailyExpensesChart";
import ExpensesBreakdown from "../Dashboard/expensesbreakdown";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ExpenseOverview = ({ activeTab, setActiveTab, refreshKey }) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const { currency, convertAmount, formatCurrency } = useCurrency();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [timeRange, setTimeRange] = useState(7);

  const fetchTopUIData = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();
      setTotalExpenses(data.profile_total_expense);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLoadExpense = async (timeRange) => {
    setLoading(true);

    if (![7, 15, 30].includes(timeRange)) return;

    try {
      const token = getToken();
      const response = await fetch(
        `${BACKEND_URL}/profile/transaction-trend?transaction_type=expense&days=${timeRange}`,
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
      console.log("Expense trend data:", data);
      setExpenseData(data);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when timeRange changes or refreshKey changes
  useEffect(() => {
    fetchTopUIData();
    handleLoadExpense(timeRange);
  }, [timeRange, refreshKey, currency]);

  return (
    <div
      className={`p-4 rounded-lg ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
      } mb-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => {
            const selectedValue = parseInt(e.target.value, 10);
            setTimeRange(selectedValue);
          }}
          className={`border rounded-md px-3 py-1 cursor-pointer ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          <option value="7">Last 7 days</option>
          <option value="15">Last 15 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("Daily Expenses")}
          className={`px-4 py-2 rounded-tl-md rounded-bl-md cursor-pointer hover:opacity-80 active:scale-95 transition-all ${
            activeTab === "Daily Expenses"
              ? darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
              : darkMode
              ? "bg-gray-800 text-gray-400"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Daily Expenses
        </button>
        <button
          onClick={() => setActiveTab("Category Breakdown")}
          className={`px-4 py-2 rounded-tr-md rounded-br-md cursor-pointer hover:opacity-80 active:scale-95 transition-all ${
            activeTab === "Category Breakdown"
              ? darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
              : darkMode
              ? "bg-gray-800 text-gray-400"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Category Breakdown
        </button>
      </div>

      <div className={`min-h-[400px] ${activeTab === "Category Breakdown" ? "h-auto" : "h-[400px]"}`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : activeTab === "Daily Expenses" ? (
          <DailyExpensesChart data={expenseData} />
        ) : (
          <ExpensesBreakdown
            totalExpenses={totalExpenses}
            refreshKey={refreshKey}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
