import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Layout/sidebar";
import AddExpenseButton from "../../components/Expense/AddExpenseButton";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseModal from "../../components/Expense/AddExpenseModal";
import EditExpenseModal from "../../components/Expense/EditExpenseModal";
import DeleteConfirmationModal from "../../components/Expense/DeleteConfirmationModal";
import Profile from "../../components/Layout/profile";
import DarkMode from "../../components/Layout/darkmode";
import ChatAssistant from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Expense = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${BACKEND_URL}/profile/income_expense_table?transaction_type=expense&days=30`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        const formattedExpenses = data.map((expense, index) => ({
          id: index + 1,
          category: expense.category,
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          isRecurring: expense.recurring,
          recurringPeriod: expense.recurrence_duration || null,
        }));

        setExpenses(formattedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [activeTab, setActiveTab] = useState("Daily Expenses");
  const [timeRange, setTimeRange] = useState(7);

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
    recurring: false,
    recurrence_duration: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleAddExpense = async () => {
    const expenseToAdd = {
      description: newExpense.description,
      amount: Number.parseFloat(newExpense.amount),
      category: newExpense.category,
      recurring: newExpense.recurring,
      recurrence_duration: newExpense.recurrence_duration,
    };

    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/add_expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseToAdd),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const data = await response.json();
      setExpenses((prev) => [...prev, data]);
      setShowAddModal(false);
      setNewExpense({
        category: "",
        amount: "",
        description: "",
        recurring: false,
        recurrence_duration: "",
      });
      toast.success("Expense added successfully");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleEditExpense = async () => {
    if (!currentExpense) return;

    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/edit_expense`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_id: currentExpense.transaction_id,
          category: currentExpense.category,
          amount: currentExpense.amount,
          description: currentExpense.description,
          recurring: currentExpense.recurring,
          recurrence_duration: currentExpense.recurrence_duration,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      // Refresh all data
      const fetchExpenses = async () => {
        try {
          const response = await fetch(
            `${BACKEND_URL}/profile/income_expense_table?transaction_type=expense&days=30`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch expenses");
          }

          const data = await response.json();
          const formattedExpenses = data.map((expense, index) => ({
            id: index + 1,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            description: expense.description,
            isRecurring: expense.recurring,
            recurringPeriod: expense.recurrence_duration || null,
          }));

          setExpenses(formattedExpenses);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };

      await fetchExpenses();
      setShowEditModal(false);
      setCurrentExpense(null);
      toast.success("Expense updated successfully");
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/delete_expense`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transaction_id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Refresh all data
      const fetchExpenses = async () => {
        try {
          const response = await fetch(
            `${BACKEND_URL}/profile/income_expense_table?transaction_type=expense&days=30`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch expenses");
          }

          const data = await response.json();
          const formattedExpenses = data.map((expense, index) => ({
            id: index + 1,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            description: expense.description,
            isRecurring: expense.recurring,
            recurringPeriod: expense.recurrence_duration || null,
          }));

          setExpenses(formattedExpenses);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };

      await fetchExpenses();
      setShowDeleteModal(false);
      setExpenseToDelete(null);
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const totalSpending = expenses
    .reduce((sum, expense) => sum + expense.amount, 0)
    .toFixed(2);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Sidebar />
      <div className="w-4/5 ml-[calc(20%-15px)] p-6 min-h-screen relative">
        {/* Header Section */}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Expenses</h1>
              <p
                className={`mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage your expenses and track your spending.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-28">
          {/* Expense Actions Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Financial Summary</h2>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } text-sm`}
              >
                Total spending:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalSpending)}
              </p>
            </div>
            <AddExpenseButton setShowAddModal={setShowAddModal} />
          </div>

          <div
            className={`border ${
              darkMode ? "border-gray-800" : "border-gray-200"
            } rounded-xl overflow-hidden shadow-md mb-6`}
          >
            <ExpenseOverview
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <ExpenseList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortConfig={sortConfig}
            handleSort={handleSort}
            setCurrentExpense={setCurrentExpense}
            setShowEditModal={setShowEditModal}
            handleDeleteExpense={(id) => {
              setExpenseToDelete(id);
              setShowDeleteModal(true);
            }}
            timeRange={timeRange}
          />
        </div>
        <AddExpenseModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleAddExpense={handleAddExpense}
        />
        <EditExpenseModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          currentExpense={currentExpense}
          setCurrentExpense={setCurrentExpense}
          handleEditExpense={handleEditExpense}
        />
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setExpenseToDelete(null);
          }}
          onConfirm={() => handleDeleteExpense(expenseToDelete)}
          itemName="expense"
        />
      </div>
      <ChatAssistant darkMode={darkMode} />
    </div>
  );
};

export default Expense;
