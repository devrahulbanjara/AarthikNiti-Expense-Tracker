"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react"
import axios from "axios"

// Import extracted components
import Sidebar from "../../components/Layout/sidebar"
import Profile from "../../components/Layout/profile"
import DarkMode from "../../components/Layout/darkmode"
import RecentTransactions from "../../components/Dashboard/recenttransactions"
import ExpensesBreakdown from "../../components/Dashboard/expensesbreakdown"
import UpcomingBills from "../../components/Dashboard/upcomingbills"
import NetSavings from "../../components/Dashboard/netsavings"
import IncomeVsExpensesChart from "../../components/Dashboard/income-expenses-chart"
import EditTransactionModal from "../../components/Dashboard/EditTransactionModal"
import Chatbot from "../../components/Chatbot/chatbot"
import { useTheme } from "../../context/ThemeContext"

const initialTransactions = [
  { id: 1, type: "income", amount: 2500, category: "Salary", description: "Monthly salary", date: "2025-03-15" },
  { id: 2, type: "expense", amount: 120, category: "Food", description: "Grocery shopping", date: "2025-03-14" },
  { id: 3, type: "expense", amount: 45, category: "Transportation", description: "Uber ride", date: "2025-03-13" },
  { id: 4, type: "expense", amount: 200, category: "Bills", description: "Electricity bill", date: "2025-03-10" },
  { id: 5, type: "expense", amount: 60, category: "Entertainment", description: "Movie tickets", date: "2025-03-09" },
]

const expenseCategories = [
  { name: "Food", color: "#f97316" },
  { name: "Transportation", color: "#8b5cf6" },
  { name: "Entertainment", color: "#22c55e" },
  { name: "Shopping", color: "#ec4899" },
  { name: "Bills", color: "#3b82f6" },
  { name: "Other", color: "#6b7280" },
]

const DashboardPage = () => {
  const navigate = useNavigate()
  // Use the global theme context
  const { darkMode } = useTheme()

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem("access_token")

      if (!accessToken) {
        navigate("/")
        return
      }

      try {
        const response = await axios.get("http://localhost:8000/auth/validate-token", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!response.data.valid) {
          localStorage.removeItem("access_token")
          navigate("/")
        }
      } catch (error) {
        console.error("Token validation error:", error)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("access_token")
          navigate("/")
        }
      }
    }

    validateToken()
  }, [navigate])

  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // calculate totals for income and expenses
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const totalBalance = totalIncome - totalExpenses
  const spentPercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0
  const isOverBudget = spentPercentage > 80

  // filter transactions
  const filteredTransactions = transactions.filter((t) => {
    return (
      (!searchTerm ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.dateFrom || new Date(filters.dateFrom) <= new Date(t.date)) &&
      (!filters.dateTo || new Date(filters.dateTo) >= new Date(t.date)) &&
      (!filters.description || t.description.toLowerCase().includes(filters.description.toLowerCase()))
    )
  })

  // calculate expenses breakdown data
  const expenseBreakdownData = expenseCategories
    .map((category) => {
      const totalForCategory = transactions
        .filter((t) => t.type === "expense" && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        name: category.name,
        value: totalForCategory,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => setFilters({ category: "", dateFrom: "", dateTo: "", description: "" })

  const handleSubmit = (transactionData) => {
    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === transactionData.id ? transactionData : t)))
    } else {
      setTransactions([...transactions, transactionData])
    }

    setIsAddModalOpen(false)
    setEditingTransaction(null)
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id) => setTransactions(transactions.filter((t) => t.id !== id))

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
  }

  useEffect(() => {
    if (!isAddModalOpen) {
      setEditingTransaction(null)
    }
  }, [isAddModalOpen])

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={`flex ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <Sidebar />

      {/* main content dashboard  */}
      <div className="w-4/5 ml-[calc(20%-15px)] p-6 min-h-screen relative">
        <div
          className={`fixed top-0 left-[calc(20%-15px)] right-0 ${darkMode ? "bg-[#0f172a]" : "bg-white"} z-30 p-6 transition-all duration-300 ${
            scrolled
              ? `${darkMode ? "bg-opacity-80" : "bg-opacity-90"} backdrop-blur-sm border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`
              : "bg-opacity-100"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                View your financial overview and recent activity.
              </p>
            </div>
            <div className="flex space-x-3 mr-3">
              <DarkMode />
              <Profile handleLogout={handleLogout} />
            </div>
          </div>
        </div>

        {/* Content with padding to account for fixed header */}
        <div className="pt-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <Card
              title="Total Balance"
              amount={`$${totalBalance.toFixed(2)}`}
              change="+2.5% from last month"
              icon={DollarSign}
            />
            <Card
              title="Total Income"
              amount={`$${totalIncome.toFixed(2)}`}
              change="+5.2% from last month"
              icon={ArrowUp}
            />
            <Card
              title="Total Expenses"
              amount={`$${totalExpenses.toFixed(2)}`}
              change="-1.8% from last month"
              icon={ArrowDown}
            />
            <BudgetCard percentage={spentPercentage} isOverBudget={isOverBudget} />
          </div>

          {/* recent transactions and expenses breakdown menu */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-7 h-full">
              <RecentTransactions
                transactions={filteredTransactions}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showAll={showAllTransactions}
                setShowAll={setShowAllTransactions}
                onAdd={() => setIsAddModalOpen(true)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filters={filters}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                expenseCategories={expenseCategories}
              />
            </div>
            <div className="md:col-span-3 h-full">
              <ExpensesBreakdown
                data={expenseBreakdownData}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                totalExpenses={totalExpenses}
              />
            </div>
          </div>

          {/* Upcoming Bills and Net Savings Trend */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-4 h-full">
              <UpcomingBills />
            </div>
            <div className="md:col-span-6 h-full">
              <NetSavings />
            </div>
          </div>

          {/* Income vs Expenses Chart - Moved to the bottom with left border */}
          <div className={`mt-6 border-l-2 ${darkMode ? "border-gray-700" : "border-gray-200"} pl-4`}>
            <IncomeVsExpensesChart />
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal Component */}
      <EditTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        editingTransaction={editingTransaction}
        expenseCategories={expenseCategories}
      />

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  )
}

// Card components
const Card = ({ title, amount, change, icon: Icon }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`${darkMode ? "bg-[#111827]" : "bg-white"} p-3 rounded-lg border ${darkMode ? "border-gray-800" : "border-gray-300"} text-center`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold">{title}</h2>
        <Icon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
      </div>
      <p className="text-2xl font-bold mt-2">{amount}</p>
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{change}</p>
    </div>
  )
}

const BudgetCard = ({ percentage, isOverBudget }) => {
  const { darkMode } = useTheme()

  return (
    <div
      className={`${darkMode ? "bg-[#111827]" : "bg-white"} p-3 rounded-lg border ${darkMode ? "border-gray-800" : "border-gray-300"} text-center ${isOverBudget ? "scale-95" : ""}`}
    >
      <div className="flex items-center justify-center">
        <h2 className="text-md font-semibold mr-2">Spent</h2>
        <span className="text-lg">🧾</span>
      </div>
      <p className="text-2xl font-bold mt-2">{percentage}%</p>
      <div className={`w-full ${darkMode ? "bg-[#1f2937]" : "bg-gray-200"} rounded-full h-1.5 mt-2`}>
        <div
          className={`h-1.5 rounded-full ${
            percentage > 80 ? "bg-red-500" : percentage > 60 ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default DashboardPage
