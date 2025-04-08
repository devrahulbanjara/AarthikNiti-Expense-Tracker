"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Layout/sidebar"
import AddExpenseButton from "../../components/Expense/AddExpenseButton"
import ExpenseOverview from "../../components/Expense/ExpenseOverview"
import ExpenseList from "../../components/Expense/ExpenseList"
import AddExpenseModal from "../../components/Expense/AddExpenseModal"
import EditExpenseModal from "../../components/Expense/EditExpenseModal"
import Profile from "../../components/Layout/profile"
import DarkMode from "../../components/Layout/darkmode"
import ChatAssistant from "../../components/Chatbot/chat-assistant"
import { useTheme } from "../../context/ThemeContext"

const Expense = () => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: "Food",
      amount: 45.5,
      date: "2023-04-15",
      paymentMethod: "Credit Card",
      description: "Grocery shopping",
      isRecurring: false,
    },
    {
      id: 2,
      category: "Transportation",
      amount: 30.0,
      date: "2023-04-14",
      paymentMethod: "Cash",
      description: "Fuel",
      isRecurring: true,
      recurringPeriod: "1 week",
    },
    {
      id: 3,
      category: "Bills",
      amount: 120.75,
      date: "2023-04-12",
      paymentMethod: "Bank Transfer",
      description: "Electricity bill",
      isRecurring: true,
      recurringPeriod: "1 month",
    },
    {
      id: 4,
      category: "Entertainment",
      amount: 65.0,
      date: "2023-04-10",
      paymentMethod: "Credit Card",
      description: "Movie tickets and dinner",
      isRecurring: false,
    },
    {
      id: 5,
      category: "Shopping",
      amount: 89.99,
      date: "2023-04-08",
      paymentMethod: "Debit Card",
      description: "New clothes",
      isRecurring: false,
    },
    {
      id: 6,
      category: "Health",
      amount: 45.0,
      date: "2023-04-05",
      paymentMethod: "Credit Card",
      description: "Pharmacy",
      isRecurring: false,
    },
    {
      id: 7,
      category: "Food",
      amount: 32.5,
      date: "2023-04-03",
      paymentMethod: "Cash",
      description: "Restaurant",
      isRecurring: false,
    },
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentExpense, setCurrentExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("activeTab") || "Daily Expenses"
    }
    return "Daily Expenses"
  })
  const [timeRange, setTimeRange] = useState("Last 7 days")

  // New expense state
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    description: "",
    isRecurring: false,
    recurringPeriod: "1 month",
  })

  // Sample data for charts
  const [dailyExpensesData, setDailyExpensesData] = useState([
    { day: "Mon", amount: 120 },
    { day: "Tue", amount: 80 },
    { day: "Wed", amount: 200 },
    { day: "Thu", amount: 150 },
    { day: "Fri", amount: 180 },
    { day: "Sat", amount: 250 },
    { day: "Sun", amount: 100 },
  ])

  const [categoryBreakdownData, setCategoryBreakdownData] = useState([
    { name: "Food", value: 35, amount: 350, color: "#8884d8" },
    { name: "Transportation", value: 20, amount: 200, color: "#82ca9d" },
    { name: "Bills", value: 15, amount: 150, color: "#ffc658" },
    { name: "Shopping", value: 10, amount: 100, color: "#ff8042" },
    { name: "Entertainment", value: 20, amount: 200, color: "#0088fe" },
  ])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
  }

  const handleAddExpense = () => {
    // Generate a unique ID for the new expense
    const newId = Math.max(0, ...expenses.map((e) => e.id)) + 1
    const expenseToAdd = {
      ...newExpense,
      id: newId,
      amount: Number.parseFloat(newExpense.amount),
    }

    setExpenses((prev) => [...prev, expenseToAdd])
    setShowAddModal(false)

    // Reset the form
    setNewExpense({
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      description: "",
      isRecurring: false,
      recurringPeriod: "1 month",
    })
  }

  const handleEditExpense = () => {
    if (!currentExpense) return

    setExpenses((prev) => prev.map((expense) => (expense.id === currentExpense.id ? currentExpense : expense)))
    setShowEditModal(false)
    setCurrentExpense(null)
  }

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    }
  }

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction })
  }

  // Calculate total spending
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)

  return (
    <div
      className={`flex ${darkMode ? "bg-gray-950 text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <Sidebar />
      <div className="w-4/5 ml-[calc(20%-15px)] p-6 min-h-screen relative">
        {/* Header Section */}
        <div
          className={`fixed top-0 left-[calc(20%-15px)] right-0 ${darkMode ? "bg-gray-950" : "bg-white"} z-30 p-6 transition-all duration-300 ${scrolled ? `${darkMode ? "bg-opacity-80" : "bg-opacity-90"} backdrop-blur-sm border-b ${darkMode ? "border-gray-800" : "border-gray-200"}` : "bg-opacity-100"}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Expenses</h1>
              <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Manage your expenses and track your spending.
              </p>
            </div>
            <div className="flex space-x-4">
              <DarkMode />
              <Profile handleLogout={handleLogout} />
            </div>
          </div>
        </div>

        <div className="pt-28">
          {/* Expense Actions Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Financial Summary</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
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
            className={`border ${darkMode ? "border-gray-800" : "border-gray-200"} rounded-xl overflow-hidden shadow-md mb-6`}
          >
            <ExpenseOverview
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              dailyExpensesData={dailyExpensesData}
              categoryBreakdownData={categoryBreakdownData}
            />
          </div>
          <ExpenseList
            expenses={expenses}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortConfig={sortConfig}
            handleSort={handleSort}
            setCurrentExpense={setCurrentExpense}
            setShowEditModal={setShowEditModal}
            handleDeleteExpense={handleDeleteExpense}
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
      </div>
      <ChatAssistant />
    </div>
  )
}

export default Expense;