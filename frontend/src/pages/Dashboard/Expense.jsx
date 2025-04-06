"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./sidebar"
import ExpenseHeader from "./ExpenseHeader"
import AddExpenseButton from "./AddExpenseButton"
import ExpenseOverview from "./ExpenseOverview"
import ExpenseList from "./ExpenseList"
import AddExpenseModal from "./AddExpenseModal"
import EditExpenseModal from "./EditExpenseModal"

const Expense = () => {
  const navigate = useNavigate()

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")
  const [scrolled, setScrolled] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentExpense, setCurrentExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "Daily Expenses")
  const [timeRange, setTimeRange] = useState("Last 7 days")

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    description: "",
    isRecurring: false,
    recurringPeriod: "1 month",
  })

  const dailyExpensesData = [
    { day: "Sun", amount: 90 },
    { day: "Mon", amount: 50 },
    { day: "Tue", amount: 120 },
    { day: "Wed", amount: 30 },
    { day: "Thu", amount: 80 },
    { day: "Fri", amount: 25 },
    { day: "Sat", amount: 150 }
  ]

  const categoryBreakdownData = [
    { name: "Food", value: 31, amount: 155.5, color: "#8884d8" },
    { name: "Bills", value: 23, amount: 115.0, color: "#82ca9d" },
    { name: "Shopping", value: 23, amount: 115.0, color: "#ffc658" },
    { name: "Travel", value: 15, amount: 75.0, color: "#ff8042" },
    { name: "Other", value: 8, amount: 40.0, color: "#0088fe" },
  ]

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const mockExpenses = [
        {
          id: "1",
          category: "Food",
          amount: 25.5,
          date: "2023-03-14",
          paymentMethod: "Credit Card",
          description: "Lunch",
          isRecurring: false,
        },
        {
          id: "2",
          category: "Transportation",
          amount: 45.0,
          date: "2023-03-10",
          paymentMethod: "Mobile Payment",
          description: "Uber",
          isRecurring: true,
        },
        {
          id: "3",
          category: "Bills",
          amount: 120.0,
          date: "2023-03-05",
          paymentMethod: "Bank Transfer",
          description: "Electricity",
          isRecurring: true,
        },
        {
          id: "4",
          category: "Shopping",
          amount: 89.99,
          date: "2023-03-02",
          paymentMethod: "Credit Card",
          description: "Clothes",
          isRecurring: false,
        },
      ]
      setExpenses(mockExpenses)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    localStorage.setItem("darkMode", !darkMode)
  }

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.date || !newExpense.paymentMethod) {
      alert("Please fill in all required fields")
      return
    }

    const newExpenseObj = {
      ...newExpense,
      id: Date.now().toString(),
      amount: Number.parseFloat(newExpense.amount),
    }

    setExpenses((prev) => [...prev, newExpenseObj])
    setNewExpense({
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      description: "",
      isRecurring: false,
      recurringPeriod: "1 month",
    })
    setShowAddModal(false)
  }

  const handleEditExpense = async () => {
    if (!currentExpense.category || !currentExpense.amount || !currentExpense.date || !currentExpense.paymentMethod) {
      alert("Please fill in all required fields")
      return
    }

    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === currentExpense.id
          ? { ...currentExpense, amount: Number.parseFloat(currentExpense.amount) }
          : expense,
      ),
    )
    setShowEditModal(false)
    setCurrentExpense(null)
  }

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    }
  }

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expenses data...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <Sidebar darkMode={darkMode} />
      <div className="w-4/5 ml-[20%] p-6 min-h-screen relative md:w-5/6 md:ml-[16.67%] sm:w-3/4 sm:ml-[25%] xs:w-2/3 xs:ml-[33.33%]">
        <ExpenseHeader
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          handleLogout={handleLogout}
          scrolled={scrolled}
        />
        <div className="pt-16">
          <div className={`w-full h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} my-4 mt-16`}></div>
          <AddExpenseButton setShowAddModal={setShowAddModal} />
          <ExpenseOverview
            darkMode={darkMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            dailyExpensesData={dailyExpensesData}
            categoryBreakdownData={categoryBreakdownData}
          />
          <ExpenseList
            darkMode={darkMode}
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
          darkMode={darkMode}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleAddExpense={handleAddExpense}
        />
        <EditExpenseModal
          darkMode={darkMode}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          currentExpense={currentExpense}
          setCurrentExpense={setCurrentExpense}
          handleEditExpense={handleEditExpense}
        />
      </div>
    </div>
  )
}

export default Expense;