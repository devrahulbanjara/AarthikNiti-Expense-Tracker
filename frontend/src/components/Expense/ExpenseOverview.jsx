"use client";

import DailyExpensesChart from "./DailyExpensesChart";
import ExpensesBreakdown from "../Dashboard/expensesbreakdown";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

const ExpenseOverview = ({ activeTab, setActiveTab }) => {
  const { darkMode } = useTheme();
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTopUIData = async () => {
    try {
      const response = await fetch("http://localhost:8000/profile/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();
      setTotalExpenses(data.profile_total_expense);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchTopUIData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [timeRange, setTimeRange] = useState(15);

  const handleLoadExpense = async (timeRange) => {
    setLoading(true);

    if (![7, 15, 30].includes(timeRange)) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/profile/transaction-trend?transaction_type=income&days=${timeRange}`,
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
      setExpenseData(data);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadExpense(7);
  }, []);

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
            handleLoadExpense(selectedValue);
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

      <div className="h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg font-medium">
              {darkMode ? "Loading..." : "Loading..."}
            </p>
          </div>
        ) : activeTab === "Daily Expenses" ? (
          <DailyExpensesChart data={expenseData} />
        ) : (
          <ExpensesBreakdown totalExpenses={totalExpenses} />
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
