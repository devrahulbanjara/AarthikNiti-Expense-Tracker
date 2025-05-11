"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Calendar } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpcomingBills = () => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingBills = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/upcoming-bills`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch upcoming bills");

      const data = await response.json();
      setBills(data.upcoming_bills);
    } catch (error) {
      console.error("Error fetching upcoming bills:", error);
      setBills([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingBills();
    const intervalId = setInterval(fetchUpcomingBills, 300000); // Refresh every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  const getDaysDifference = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse the due date properly
    let due;
    try {
      // Try to parse the date - if it's ISO format this will work
      due = new Date(dueDate);

      // Check if the date is valid
      if (isNaN(due.getTime())) {
        // If the date format is DD-MM-YYYY or MM-DD-YYYY, handle it
        if (dueDate.includes("-")) {
          const parts = dueDate.split("-");
          // Try both date formats
          due = new Date(parts[2], parts[1] - 1, parts[0]); // DD-MM-YYYY

          if (isNaN(due.getTime())) {
            due = new Date(parts[2], parts[0] - 1, parts[1]); // MM-DD-YYYY
          }
        } else if (dueDate.includes("/")) {
          // If the date format is DD/MM/YYYY or MM/DD/YYYY
          const parts = dueDate.split("/");
          due = new Date(parts[2], parts[1] - 1, parts[0]); // DD/MM/YYYY

          if (isNaN(due.getTime())) {
            due = new Date(parts[2], parts[0] - 1, parts[1]); // MM/DD/YYYY
          }
        }
      }

      // If we still have an invalid date, default to today
      if (isNaN(due.getTime())) {
        console.warn(
          `Invalid date format for bill: ${dueDate}, defaulting to today`
        );
        due = new Date();
      }
    } catch (error) {
      console.error(`Error parsing date: ${dueDate}`, error);
      due = new Date(); // Default to today if there's any error
    }

    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (days) => {
    if (days < 0)
      return `Overdue by ${Math.abs(days)} day${
        Math.abs(days) !== 1 ? "s" : ""
      }`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  return (
    <div
      className={`p-4 lg:p-6 rounded-lg border transition-all duration-300
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        hover:shadow-md h-full`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Bills</h2>
        <Calendar
          className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span
            className={`mt-3 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading upcoming bills...
          </span>
        </div>
      ) : bills.length === 0 ? (
        <div className="text-center py-12">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You have no upcoming bills due within the next 30 days.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map((bill) => {
            const daysDiff = getDaysDifference(bill.next_payment_date);
            const isOverdue = daysDiff < 0;
            const isDueSoon = daysDiff >= 0 && daysDiff <= 3;

            return (
              <div
                key={bill.id}
                className={`border rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition-all duration-200 
                ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3 flex-grow">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 
                    ${
                      isOverdue
                        ? "bg-red-500"
                        : isDueSoon
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }
                  `}
                  ></div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm break-words">
                      {bill.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
                        ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
                    >
                      {bill.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto pl-5 sm:pl-0">
                  <div
                    className={`text-xs font-medium whitespace-nowrap 
                    ${
                      isOverdue
                        ? "text-red-500"
                        : isDueSoon
                        ? "text-yellow-500"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {formatDueDate(daysDiff)}
                  </div>
                  <div className="font-semibold text-sm">
                    ${bill.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBills;
