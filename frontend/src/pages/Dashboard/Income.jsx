"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Profile from "../../components/Layout/profile";
import DarkMode from "../../components/Layout/darkmode";
import AddIncome from "../../components/Income/AddIncome";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeSources from "../../components/Income/IncomeSources";
import Chatbot from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const incomeSources = [
  { name: "Salary", color: "#3b82f6" },
  { name: "Freelance", color: "#8b5cf6" },
  { name: "Investments", color: "#22c55e" },
  { name: "Side Gig", color: "#f97316" },
  { name: "Bonus", color: "#ec4899" },
  { name: "Other", color: "#6b7280" },
];

const Income = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { getToken } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [timeRange, setTimeRange] = useState("7");
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const token = getToken();
        const dashboardResponse = await fetch(
          `${BACKEND_URL}/profile/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!dashboardResponse.ok)
          throw new Error("Failed to fetch dashboard data");

        const dashboardData = await dashboardResponse.json();
        setTotalIncome(dashboardData.profile_total_income);

        const incomeResponse = await fetch(
          `${BACKEND_URL}/profile/income_expense_table?transaction_type=income&days=30`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!incomeResponse.ok) throw new Error("Failed to fetch incomes");

        const incomeData = await incomeResponse.json();
        console.log("Income data from API:", incomeData);

        const formattedIncomes = incomeData.map((income, index) => ({
          id: index + 1,
          source: income.category,
          amount: income.amount,
          date: income.date,
          description: income.description,
          recurring: income.recurring,
          recurrence_duration: income.recurrence_duration || null,
        }));

        setIncomes(formattedIncomes);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();

      if (!token) {
        navigate("/");
        return;
      }
    };

    validateToken();
  }, [navigate, getToken]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEdit = async (income) => {
    setEditingIncome(income);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (incomeData, isEditing) => {
    try {
      const token = getToken();
      const incomeToAdd = {
        category: incomeData.category || incomeData.source,
        description: incomeData.description || "",
        amount: Number.parseFloat(incomeData.amount),
      };

      if (isEditing) {
        // Update existing income
        const response = await fetch(`${BACKEND_URL}/profile/edit_income`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transaction_id: editingIncome.transaction_id,
            ...incomeToAdd,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update income");
        }
      } else {
        // Add new income
        const response = await fetch(`${BACKEND_URL}/profile/update_income`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(incomeToAdd),
        });

        if (!response.ok) {
          throw new Error("Failed to add income");
        }
      }

      // Refresh all data without reloading the page
      const fetchIncomeData = async () => {
        try {
          const dashboardResponse = await fetch(
            `${BACKEND_URL}/profile/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!dashboardResponse.ok)
            throw new Error("Failed to fetch dashboard data");

          const dashboardData = await dashboardResponse.json();
          setTotalIncome(dashboardData.profile_total_income);

          const incomeResponse = await fetch(
            `${BACKEND_URL}/profile/income_expense_table?transaction_type=income&days=30`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!incomeResponse.ok) throw new Error("Failed to fetch incomes");

          const incomeData = await incomeResponse.json();
          const formattedIncomes = incomeData.map((income, index) => ({
            id: index + 1,
            source: income.category,
            amount: income.amount,
            date: income.date,
            description: income.description,
            recurring: income.recurring,
            recurrence_duration: income.recurrence_duration || null,
          }));

          setIncomes(formattedIncomes);
        } catch (error) {
          console.error("Error fetching income data:", error);
        }
      };

      await fetchIncomeData();
      setIsAddModalOpen(false);
      setEditingIncome(null);
      toast.success(
        isEditing ? "Income updated successfully" : "Income added successfully"
      );
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("Failed to save income. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingIncome(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      setIncomes((prev) => prev.filter((income) => income.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Sidebar />

      {/* main content income page */}
      <div className="w-4/5 ml-[calc(20%-15px)] p-6 min-h-screen relative">
        <div
          className={`fixed top-0 left-[calc(20%-15px)] right-0 ${
            darkMode ? "bg-gray-950" : "bg-white"
          } z-30 p-6 transition-all duration-300 ${
            scrolled
              ? `${
                  darkMode ? "bg-opacity-80" : "bg-opacity-90"
                } backdrop-blur-sm border-b ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`
              : "bg-opacity-100"
          }`}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Income</h1>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Manage your income sources and track your earnings.
                </p>
              </div>
              <div className="flex items-center space-x-3 mr-3">
                <DarkMode />
                <Profile handleLogout={handleLogout} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-28">
          {/* Income Actions Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Financial Summary</h2>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Total earnings:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalIncome)}
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#065336] hover:bg-[#054328] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-5" />
              Add Income
            </button>
          </div>

          {/* Income Overview Component with explicit border */}
          <div
            className={`border ${
              darkMode ? "border-gray-800" : "border-gray-200"
            } rounded-xl overflow-hidden shadow-md mb-6`}
          >
            <IncomeOverview timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>

          {/* Income Sources Component */}
          <IncomeSources
            incomeSources={incomeSources}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Add Income Modal Component */}
      <AddIncome
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingIncome={editingIncome}
        incomeSources={incomeSources}
      />

      {/* Chatbot Component */}
      <Chatbot darkMode={darkMode} />
    </div>
  );
};

export default Income;
