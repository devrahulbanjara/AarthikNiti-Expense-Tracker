"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import axios from "axios"

// Import components
import Sidebar from "../../components/Layout/sidebar"
import Profile from "../../components/Layout/profile"
import DarkMode from "../../components/Layout/darkmode"
import AddIncome from "../../components/Income/AddIncome"
import IncomeOverview from "../../components/Income/IncomeOverview"
import IncomeSources from "../../components/Income/IncomeSources"
import Chatbot from "../../components/Chatbot/chatbot"
import { useTheme } from "../../context/ThemeContext"

const initialIncomes = [
  { id: 1, source: "Salary", amount: 250000, description: "Monthly salary", date: "2025-03-15", recurring: true },
  {
    id: 2,
    source: "Freelance",
    amount: 450000,
    description: "Website design project",
    date: "2025-03-10",
    recurring: false,
  },
  {
    id: 3,
    source: "Investments",
    amount: 2527070,
    description: "Dividend payment",
    date: "2025-03-05",
    recurring: true,
  },
  { id: 4, source: "Side Gig", amount: 2252887, description: "Tutoring", date: "2025-03-01", recurring: true },
  { id: 5, source: "Bonus", amount: 2985698, description: "Performance bonus", date: "2025-02-28", recurring: false },
]

const incomeSources = [
  { name: "Salary", color: "#3b82f6" },
  { name: "Freelance", color: "#8b5cf6" },
  { name: "Investments", color: "#22c55e" },
  { name: "Side Gig", color: "#f97316" },
  { name: "Bonus", color: "#ec4899" },
  { name: "Other", color: "#6b7280" },
]

const Income = () => {
  const navigate = useNavigate()
  // Use the global theme context
  const { darkMode } = useTheme()

  const [incomes, setIncomes] = useState(initialIncomes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [timeRange, setTimeRange] = useState("Last 7 days")

  // Pass this to the Sidebar component
  const activePage = "income"

  // Calculate total income
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  // Token validation
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

  // Generate chart data for the last 7 days
  const getDayName = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const date = new Date(dateString)
    return days[date.getDay()]
  }

  const getLast7Days = () => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Add some sample amount data to ensure bars are visible
      const sampleAmounts = [250000, 180000, 320000, 150000, 420000, 280000, 190000]

      result.push({
        date: date.toISOString().split("T")[0],
        day: getDayName(date),
        // Use sample data to ensure bars are visible
        amount: sampleAmounts[6 - i],
      })
    }
    return result
  }

  const chartData = getLast7Days()

  // Fill in the chart data with actual income amounts
  incomes.forEach((income) => {
    const incomeDate = income.date
    const chartDay = chartData.find((day) => day.date === incomeDate)
    if (chartDay) {
      chartDay.amount += income.amount
    }
  })

  const handleSubmit = (incomeData, isEditing) => {
    if (isEditing) {
      setIncomes(incomes.map((income) => (income.id === incomeData.id ? incomeData : income)))
    } else {
      setIncomes([...incomes, incomeData])
    }

    setIsAddModalOpen(false)
    setEditingIncome(null)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingIncome(null)
  }

  const handleEdit = (income) => {
    setEditingIncome(income)
    setIsAddModalOpen(true)
  }

  const handleDelete = (id) => setIncomes(incomes.filter((income) => income.id !== id))

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
  }

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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div
      className={`flex ${darkMode ? "bg-gray-950 text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <Sidebar />

      {/* main content income page */}
      <div className="w-4/5 ml-[calc(20%-15px)] p-6 min-h-screen relative">
        <div
          className={`fixed top-0 left-[calc(20%-15px)] right-0 ${darkMode ? "bg-gray-950" : "bg-white"} z-30 p-6 transition-all duration-300 ${
            scrolled
              ? `${darkMode ? "bg-opacity-80" : "bg-opacity-90"} backdrop-blur-sm border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`
              : "bg-opacity-100"
          }`}
        >
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Income</h1>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
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

        {/* Content with padding to account for fixed header - increased padding */}
        <div className="pt-28">
          {/* Income Actions Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Financial Summary</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
                Total earnings:{" "}
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalIncome / 100)}
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
            className={`border ${darkMode ? "border-gray-800" : "border-gray-200"} rounded-xl overflow-hidden shadow-md mb-6`}
          >
            <IncomeOverview chartData={chartData} timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>

          {/* Income Sources Component */}
          <IncomeSources
            incomes={incomes}
            incomeSources={incomeSources}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatDate={formatDate}
            totalIncome={totalIncome}
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
      <Chatbot />
    </div>
  )
}

export default Income
