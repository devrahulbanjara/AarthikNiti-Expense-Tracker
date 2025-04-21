import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Layout/sidebar";
import AddExpenseButton from "../../components/Expense/AddExpenseButton";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseModal from "../../components/Expense/AddExpenseModal";
import EditExpenseModal from "../../components/Expense/EditExpenseModal";
import DeleteConfirmationModal from "../../components/Expense/DeleteConfirmationModal";
import ChatAssistant from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Header from "../../components/Layout/Header";
import AnimatedCounter from "../../components/UI/AnimatedCounter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Expense = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
  const [totalSpending, setTotalSpending] = useState(0);

  // Centralized data refresh function
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      
      // Fetch dashboard data for total spending
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
      setTotalSpending(dashboardData.profile_total_expense || 0);

      // Fetch expense table data
      const expenseResponse = await fetch(
        `${BACKEND_URL}/profile/income_expense_table?transaction_type=expense&days=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!expenseResponse.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await expenseResponse.json();
      const formattedExpenses = data.map((expense, index) => ({
        id: index + 1,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        isRecurring: expense.recurring,
        recurringPeriod: expense.recurrence_duration || null,
        transaction_id: expense.transaction_id,
        recurring: expense.recurring,
        recurrence_duration: expense.recurrence_duration,
      }));

      setExpenses(formattedExpenses);
      
      // Increment refresh key to trigger re-renders in child components
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error refreshing expense data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }, [getToken, timeRange]);

  useEffect(() => {
    refreshData();
  }, [refreshData, timeRange]);

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
      setLoading(true);
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

      // Show success toast
      toast.success("Expense added successfully");
      
      // Reset form and close modal
      setShowAddModal(false);
      setNewExpense({
        category: "",
        amount: "",
        description: "",
        recurring: false,
        recurrence_duration: "",
      });
      
      // Refresh expense data
      await refreshData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = async () => {
    if (!currentExpense) return;

    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/edit_expense`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_id: currentExpense.transaction_id,
          amount: parseFloat(currentExpense.amount),
          description: currentExpense.description,
          category: currentExpense.category,
          recurring: currentExpense.recurring || false,
          recurrence_duration: currentExpense.recurring ? currentExpense.recurrence_duration : null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      // Show success message
      toast.success("Expense updated successfully");
      
      // Close the modal
      setShowEditModal(false);
      setCurrentExpense(null);

      // Refresh expense data
      await refreshData();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setLoading(true);
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

      // Show success toast
      toast.success("Expense deleted successfully");
      
      // Close modal
      setShowDeleteModal(false);
      setExpenseToDelete(null);

      // Refresh expense data
      await refreshData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} min-h-screen flex flex-col md:flex-row`}>
      <Sidebar active="expenses" />
      
      <div className="w-full md:w-4/5 md:ml-[20%] p-4 min-h-screen pb-20">
        <Header 
          title="Expenses" 
          subtitle="Manage your expenses and track your spending." 
        />
        
        <div className="pt-28 md:pt-28">
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
                $<AnimatedCounter 
                  value={parseFloat(totalSpending)} 
                  decimals={2}
                  duration={2000}
                />
              </p>
            </div>
            <AddExpenseButton setShowAddModal={setShowAddModal} disabled={loading} />
          </div>

          <div
            className={`border ${
              darkMode ? "border-gray-800" : "border-gray-200"
            } rounded-xl overflow-hidden shadow-md mb-6`}
          >
            <ExpenseOverview
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              refreshKey={refreshKey}
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
            loading={loading}
            expenseList={expenses}
            refreshKey={refreshKey}
          />
        </div>
        <AddExpenseModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleAddExpense={handleAddExpense}
          loading={loading}
        />
        <EditExpenseModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          currentExpense={currentExpense}
          setCurrentExpense={setCurrentExpense}
          handleEditExpense={handleEditExpense}
          loading={loading}
        />
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setExpenseToDelete(null);
          }}
          onConfirm={() => handleDeleteExpense(expenseToDelete)}
          itemName="expense"
          loading={loading}
        />
      </div>
      <ChatAssistant darkMode={darkMode} />
    </div>
  );
};

export default Expense;
