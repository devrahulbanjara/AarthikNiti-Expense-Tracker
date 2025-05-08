"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import AddIncome from "../../components/Income/AddIncome";
import IncomeOverview from "../../components/Income/IncomeOverview";
import IncomeSources from "../../components/Income/IncomeSources";
import Chatbot from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Header from "../../components/Layout/Header";
import AnimatedCounter from "../../components/UI/AnimatedCounter";

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  // Animation states
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Centralized data refresh function
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();

      // Fetch dashboard data for total income
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

      // Fetch income table data
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

      // Transform the data
      const formattedIncomes = incomeData.map((income, index) => ({
        id: index + 1,
        source: income.category,
        amount: income.amount,
        date: income.date,
        description: income.description,
        recurring: income.recurring,
        recurrence_duration: income.recurrence_duration || null,
        transaction_id: income.transaction_id,
      }));

      setIncomes(formattedIncomes);

      // Increment the refresh key to trigger re-renders in child components
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error refreshing income data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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

  useEffect(() => {
    // Add staggered animations
    setIsPageLoaded(true);

    const overviewTimer = setTimeout(() => {
      setShowOverview(true);
    }, 300);

    const tableTimer = setTimeout(() => {
      setShowTable(true);
    }, 600);

    return () => {
      clearTimeout(overviewTimer);
      clearTimeout(tableTimer);
    };
  }, []);

  const handleEdit = async (income) => {
    setEditingIncome(income);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (incomeData, isEditing) => {
    try {
      setLoading(true);
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

        toast.success("Income updated successfully");
      } else {
        // Add new income
        const response = await fetch(`${BACKEND_URL}/profile/add_income`, {
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

        toast.success("Income added successfully");
      }

      // Refresh the data
      await refreshData();

      // Close modal and reset editing state
      setIsAddModalOpen(false);
      setEditingIncome(null);
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("Failed to save income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/delete_income`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transaction_id: transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      // Show success toast
      toast.success("Income deleted successfully");

      // Refresh data
      await refreshData();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-white"
      } min-h-screen`}
    >
      <Sidebar active="income" scrolled={scrolled} />

      <div
        className={`flex-grow p-6 md:ml-[20%] min-h-screen relative transition-opacity duration-500 ease-out ${
          isPageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Header
          title="Income"
          subtitle="Manage your income sources and transactions"
        />

        <div className="pt-24">
          {/* Add Income Button */}
          <div
            className={`flex justify-end transition-all duration-300 ease-out ${
              isPageLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() => {
                setEditingIncome(null);
                setIsAddModalOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md 
                bg-[#065336] hover:bg-[#054328] text-white
              transition-all duration-300 transform hover:scale-105 active:scale-95`}
            >
              <Plus size={16} />
              <span>Add Income</span>
            </button>
          </div>

          {/* Overview Cards */}
          <div
            className={`mt-6 transition-all duration-500 delay-200 ease-out ${
              showOverview
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <IncomeOverview
              totalIncome={totalIncome}
              incomeSources={incomeSources}
              incomes={incomes}
              darkMode={darkMode}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              key={refreshKey}
            />
          </div>

          {/* Income Table */}
          <div
            className={`mt-8 transition-all duration-700 delay-400 ease-out ${
              showTable
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <IncomeSources
              incomes={incomes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
              darkMode={darkMode}
              key={refreshKey}
            />
          </div>
        </div>

        {/* Add/Edit Income Modal */}
        {isAddModalOpen && (
          <AddIncome
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingIncome(null);
            }}
            onSubmit={handleSubmit}
            editingIncome={editingIncome}
            darkMode={darkMode}
            incomeSources={incomeSources}
          />
        )}
      </div>

      {/* Chatbot */}
      <Chatbot darkMode={darkMode} />
    </div>
  );
};

export default Income;
