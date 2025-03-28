import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import {Home,ArrowUp,ArrowDown,BarChart,Bell,Edit,Trash,Search,Filter,User,ChevronDown,Plus,X,Moon,Sun,DollarSign,Settings,LogOut,MessageSquare,History} from "lucide-react"
import IncomeVsExpensesChart from "./income-expenses-chart"
import axios from "axios"

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

const accounts = [
  { name: "Personal", id: "personal" },
  { name: "Business", id: "business" },
  { name: "Travel", id: "travel" },
]

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: Bell, href: "/budgeting" },
]

const DashboardPage = () => {
  const navigate = useNavigate()

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
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [activeIndex, setActiveIndex] = useState(null)
  const [activeAccount, setActiveAccount] = useState("Personal")
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Enhanced chatbot state variables
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("chat") // 'chat' or 'history'
  const [chatMessages, setChatMessages] = useState(() => {
    // Load chat history from localStorage on initial render
    const savedMessages = localStorage.getItem("chatHistory")
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: 1,
            text: "Hello! I'm your financial assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]
  })
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Group chat messages by date for history view
  const chatHistoryByDate = chatMessages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => setFilters({ category: "", dateFrom: "", dateTo: "", description: "" })

  const handleSubmit = (e) => {
    e.preventDefault()

    const transactionToAdd = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      type: newTransaction.type,
      amount: Number.parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: newTransaction.date,
    }

    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? transactionToAdd : t)))
    } else {
      setTransactions([...transactions, transactionToAdd])
    }

    setIsAddModalOpen(false)
    setEditingTransaction(null)
    setNewTransaction({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setNewTransaction({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = (id) => setTransactions(transactions.filter((t) => t.id !== id))

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
  }

  // close dropdown menu when clicking outside like for profile and accounts
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-dropdown-container")) {
        setShowProfileDropdown(false)
      }
      if (showAccountDropdown && !event.target.closest(".account-dropdown-container")) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown, showAccountDropdown])

  useEffect(() => {
    if (!isAddModalOpen) {
      setEditingTransaction(null)
      setNewTransaction({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }, [isAddModalOpen])

  useEffect(() => {
    // Set light mode by default
    setDarkMode(false)
    document.documentElement.classList.remove("dark")
    localStorage.setItem("darkMode", "false")

    // Add scroll event listener
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

  // Add this useEffect to save chat messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages))
  }, [chatMessages])

  // Add this useEffect inside the DashboardPage component, after the other useEffects
  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatEndRef.current && activeTab === "chat") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, activeTab])

  // Update the dark mode toggle function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Replace the existing handleSendMessage function with this enhanced version
  const handleSendMessage = () => {
    if (chatInput.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)

      let botResponse =
        "I'm not sure how to help with that. Could you try asking about your budget, expenses, or savings?"

      const userInput = chatInput.toLowerCase()
      if (userInput.includes("budget") || userInput.includes("spending")) {
        botResponse = "Your current monthly budget is $2,500. You've spent 65% of it so far."
      } else if (userInput.includes("expense") || userInput.includes("spent")) {
        botResponse = "Your largest expense category this month is Food at $450."
      } else if (userInput.includes("income") || userInput.includes("earn")) {
        botResponse = "Your total income this month is $3,500."
      } else if (userInput.includes("save") || userInput.includes("saving")) {
        botResponse = "You've saved $5,200 this year, which is 15% of your income."
      } else if (userInput.includes("hello") || userInput.includes("hi")) {
        botResponse = "Hello! How can I assist with your financial questions today?"
      } else if (userInput.includes("clear") || userInput.includes("reset")) {
        setChatMessages([
          {
            id: Date.now(),
            text: "Chat history cleared. How can I help you today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ])
        return
      } else if (userInput.includes("help") || userInput.includes("commands")) {
        botResponse = "You can ask me about: budget, expenses, income, savings, or use commands like 'clear history'."
      }

      const botMessage = {
        id: Date.now(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  // Add this function to clear chat history
  const clearChatHistory = () => {
    setChatMessages([
      {
        id: Date.now(),
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Add this function to format timestamps
  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      className={`flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} transition-colors duration-300`}
    >
      <div
        className={`fixed top-0 left-0 w-1/5 h-full ${darkMode ? "bg-gray-900" : "bg-white"} p-4 border-r ${darkMode ? "border-gray-700" : "border-gray-200"} min-h-screen z-30 transition-colors duration-300 flex flex-col`}
      >
        <div className={`${scrolled ? "opacity-90 backdrop-blur-sm" : "opacity-100"} transition-opacity duration-300`}>
          <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>

          <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

          {/* accounts personal and other with +add account */}
          <div className="mb-4 relative account-dropdown-container">
            <div
              className={`flex justify-between items-center p-2 border rounded-md cursor-pointer ${darkMode ? "hover:bg-gray-800 border-gray-700" : "hover:bg-gray-50 border-gray-300"}`}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <span>{activeAccount}</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {showAccountDropdown && (
              <div
                className={`absolute left-0 right-0 mt-1 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} border rounded-md shadow-md z-10`}
              >
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-2 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer`}
                    onClick={() => {
                      setActiveAccount(account.name)
                      setShowAccountDropdown(false)
                    }}
                  >
                    {account.name}
                  </div>
                ))}
                <div
                  className={`p-2 border-t ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"} cursor-pointer text-blue-500`}
                >
                  + Add Account
                </div>
              </div>
            )}
          </div>

          <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />

          {/* navigation nav bars  */}
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                    item.name === "Dashboard"
                      ? darkMode
                        ? "bg-gray-800"
                        : "bg-gray-200"
                      : darkMode
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  } cursor-pointer`}
                >
                  <item.icon className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto mb-6">
          <hr className={`my-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
          <ul>
            <li>
              <Link
                to="/profile"
                className={`flex items-center py-2 px-4 rounded-md mb-1 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
              >
                <User className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center py-2 px-4 rounded-md mb-1 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer`}
              >
                <Settings className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* main content dashboard  */}
      <div className="w-4/5 ml-[20%] p-6 min-h-screen relative">
        <div
          className={`fixed top-0 left-1/5 right-0 ${darkMode ? "bg-gray-900" : "bg-white"} z-30 p-6 transition-all duration-300 ${
            scrolled
              ? `${darkMode ? "bg-opacity-80" : "bg-opacity-90"} backdrop-blur-sm border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`
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
            <div className="flex space-x-4">
              <button
                className={`p-2 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} rounded-full`}
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* profile button with dropdown */}
              <div className="relative profile-dropdown-container">
                <button
                  className={`p-2 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} rounded-full`}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <User className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`} />
                </button>

                {/* profile dropdown menu */}
                {showProfileDropdown && (
                  <div
                    className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} rounded-md border py-1 z-10`}
                  >
                    <Link
                      to="/profile"
                      className={`flex items-center px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <User className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className={`flex items-center px-4 py-2 text-sm ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <Settings className={`h-4 w-4 mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                      Settings
                    </Link>
                    <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"} my-1`}></div>
                    <button
                      className={`flex items-center w-full text-left px-4 py-2 text-sm text-red-600 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
              darkMode={darkMode}
            />
            <Card
              title="Total Income"
              amount={`$${totalIncome.toFixed(2)}`}
              change="+5.2% from last month"
              icon={ArrowUp}
              darkMode={darkMode}
            />
            <Card
              title="Total Expenses"
              amount={`$${totalExpenses.toFixed(2)}`}
              change="-1.8% from last month"
              icon={ArrowDown}
              darkMode={darkMode}
            />
            <BudgetCard percentage={spentPercentage} isOverBudget={isOverBudget} darkMode={darkMode} />
          </div>

          {/* recent transactions and expenses breakdown menu */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-7 h-full">
              <RecentTransactionsCard
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
                darkMode={darkMode}
              />
            </div>
            <div className="md:col-span-3 h-full">
              <ExpensesBreakdownCard
                data={expenseBreakdownData}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                totalExpenses={totalExpenses}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Upcoming Bills and Net Savings Trend */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-4 h-full">
              <UpcomingBillsCard darkMode={darkMode} />
            </div>
            <div className="md:col-span-6 h-full">
              <NetSavingsTrendCard darkMode={darkMode} />
            </div>
          </div>

          {/* Income vs Expenses Chart - Moved to the bottom with left border */}
          <div className={`mt-6 border-l-2 ${darkMode ? "border-gray-700" : "border-gray-200"} pl-4`}>
            <IncomeVsExpensesChart darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* add and edit transactions */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          <div className={`relative bg-white p-6 rounded-lg w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Type</label>
                <div className="flex rounded-md overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-3 ${
                      newTransaction.type === "income" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                    } cursor-pointer transition-colors`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 ${
                      newTransaction.type === "expense" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                    } cursor-pointer transition-colors`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md cursor-pointer appearance-none bg-white"
                  required
                >
                  <option value="">Select category</option>
                  {newTransaction.type === "income" ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investments">Investments</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    expenseCategories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-7 border border-gray-300 rounded-md"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md cursor-pointer pr-10"
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 font-medium"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 font-medium"
                >
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Chatbot with History Tab */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}

        {/* Chat window */}
        {isChatOpen && (
          <div
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-xl flex flex-col w-80 sm:w-96 border overflow-hidden`}
          >
            {/* Chat header */}
            <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-500 mr-2">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Financial Assistant</h3>
                <span className="text-xs ml-2 bg-blue-600 px-2 py-0.5 rounded-full">Powered by AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-blue-600 rounded p-1"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white hover:bg-blue-600 rounded p-1"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === "chat"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : darkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("chat")}
                  >
                    <div className="flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === "history"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : darkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    <div className="flex items-center justify-center">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </div>
                  </button>
                </div>

                {/* Chat content - changes based on active tab */}
                {activeTab === "chat" ? (
                  // Chat messages view
                  <div
                    className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {chatMessages.length > 0 ? (
                      chatMessages.map((message, index) => {
                        // Check if we should show the date
                        const showDate =
                          index === 0 ||
                          new Date(message.timestamp).toDateString() !==
                            new Date(chatMessages[index - 1].timestamp).toDateString()

                        // Check if this is a consecutive message from the same sender
                        const isConsecutive =
                          index > 0 &&
                          message.sender === chatMessages[index - 1].sender &&
                          new Date(message.timestamp).getTime() -
                            new Date(chatMessages[index - 1].timestamp).getTime() <
                            60000

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div
                                className={`text-xs text-center my-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              >
                                {new Date(message.timestamp).toLocaleDateString()}
                              </div>
                            )}
                            <div className={`mb-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                              {message.sender === "bot" && !isConsecutive && (
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 flex-shrink-0">
                                  <MessageSquare className="h-5 w-5" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  message.sender === "user"
                                    ? "bg-blue-500 text-white"
                                    : darkMode
                                      ? "bg-gray-700 text-white"
                                      : "bg-gray-100 text-gray-800"
                                } ${isConsecutive && message.sender === "bot" ? "ml-10" : ""}`}
                              >
                                <p>{message.text}</p>
                                <p
                                  className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                              {message.sender === "user" && !isConsecutive && (
                                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white ml-2 flex-shrink-0">
                                  <User className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          No messages yet. Start a conversation!
                        </p>
                      </div>
                    )}
                    {isTyping && (
                      <div className="flex justify-start mb-4 ml-10">
                        <div
                          className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"} rounded-lg px-4 py-2`}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  // Chat history view
                  <div
                    className={`flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Chat History</h3>
                      <button
                        onClick={clearChatHistory}
                        className={`text-xs px-2 py-1 rounded ${darkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                      >
                        Clear All
                      </button>
                    </div>

                    {Object.keys(chatHistoryByDate).length > 0 ? (
                      Object.entries(chatHistoryByDate)
                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                        .map(([date, messages]) => (
                          <div key={date} className="mb-6">
                            <div className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {new Date(date).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                              {messages.slice(0, 2).map((message) => (
                                <div key={message.id} className="mb-2 last:mb-0">
                                  <div className="flex items-start">
                                    <div
                                      className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 ${
                                        message.sender === "bot" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                                      }`}
                                    >
                                      {message.sender === "bot" ? (
                                        <MessageSquare className="h-3 w-3" />
                                      ) : (
                                        <User className="h-3 w-3" />
                                      )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-sm truncate">{message.text}</p>
                                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                        {formatTime(message.timestamp)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {messages.length > 2 && (
                                <div
                                  className={`text-xs text-center mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {messages.length - 2} more messages
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  setActiveTab("chat")
                                  // Optionally scroll to the date's messages
                                }}
                                className={`w-full text-center text-xs mt-2 py-1 rounded ${
                                  darkMode
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                View Conversation
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          No chat history available.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "chat" && (
                  <>
                    {/* Quick reply buttons */}
                    <div
                      className={`px-3 py-2 flex flex-wrap gap-2 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border-t`}
                    >
                      <button
                        onClick={() => {
                          setChatInput("What's my budget?")
                          handleSendMessage()
                        }}
                        className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      >
                        Budget
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("Show my expenses")
                          handleSendMessage()
                        }}
                        className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      >
                        Expenses
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("What's my income?")
                          handleSendMessage()
                        }}
                        className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      >
                        Income
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("How much have I saved?")
                          handleSendMessage()
                        }}
                        className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      >
                        Savings
                      </button>
                    </div>

                    {/* Chat input */}
                    <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} p-3`}>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Type a message..."
                          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-black"
                          }`}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={chatInput.trim() === ""}
                          className={`bg-blue-500 text-white rounded-r-lg px-4 py-2 ${
                            chatInput.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className={`text-xs mt-1 text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {chatInput.length > 0 ? `${chatInput.length} characters` : ""}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Update the UpcomingBillsCard component to add dropdown menu for the three dots
const UpcomingBillsCard = ({ darkMode }) => {
  const [bills, setBills] = useState([
    { id: 1, name: "Phone", category: "Bills", dueIn: "-6 days", amount: 45.0, paid: false },
    { id: 2, name: "Gym Membership", category: "Health", dueIn: "-4 days", amount: 29.99, paid: true },
    { id: 3, name: "Internet", category: "Bills", dueIn: "tomorrow", amount: 79.99, paid: false },
    { id: 4, name: "Rent", category: "Housing", dueIn: "7 days", amount: 1200.0, paid: true },
  ])

  const [activeDropdown, setActiveDropdown] = useState(null)

  const togglePaid = (id) => {
    setBills(bills.map((bill) => (bill.id === id ? { ...bill, paid: !bill.paid } : bill)))
  }

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id)
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}
    >
      <h2 className="text-lg font-semibold mb-1">Upcoming Bills</h2>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>Bills due in the next 30 days</p>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`border rounded-lg p-4 flex justify-between items-center ${
              darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <span className={`text-xs px-2 py-0.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                  {bill.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Due {bill.dueIn}</div>
              <div className="font-semibold">${bill.amount.toFixed(2)}</div>
              <div className="flex items-center">
                <button
                  onClick={() => togglePaid(bill.id)}
                  className={`w-10 h-5 rounded-full ${bill.paid ? "bg-blue-500" : darkMode ? "bg-gray-600" : "bg-gray-200"} relative cursor-pointer hover:opacity-90`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${bill.paid ? "left-5" : "left-1"}`}
                  ></div>
                </button>
              </div>
              <div className="relative">
                <button
                  className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"} cursor-pointer`}
                  onClick={() => toggleDropdown(bill.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === bill.id && (
                  <div
                    className={`absolute right-0 mt-1 w-36 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} rounded-md border z-10`}
                  >
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} cursor-pointer`}
                      onClick={() => {
                        togglePaid(bill.id)
                        setActiveDropdown(null)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Mark as paid
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-2 text-sm text-left ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} cursor-pointer`}
                      onClick={() => {
                        alert(`Reminder set for ${bill.name}`)
                        setActiveDropdown(null)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Set reminder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Update the NetSavingsTrendCard component to match the area chart design
const NetSavingsTrendCard = ({ darkMode }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const chartRef = useRef(null)

  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  const savingsData = [
    { month: "Oct", value: 1200 },
    { month: "Nov", value: 1800 },
    { month: "Dec", value: 1400 },
    { month: "Jan", value: 1900 },
    { month: "Feb", value: 2400 },
    { month: "Mar", value: 2100 },
  ]

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Calculate points for the area chart
  const chartWidth = 100
  const chartHeight = 100
  const points = savingsData.map((data, index) => {
    const x = (index / (savingsData.length - 1)) * chartWidth
    const y = chartHeight - (data.value / 2400) * chartHeight
    return { x, y, ...data }
  })

  // Create SVG path for the area
  const createAreaPath = () => {
    let path = `M${points[0].x},${points[0].y}`

    // Add curve points
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currPoint = points[i]

      // Control points for the curve
      const cp1x = prevPoint.x + (currPoint.x - prevPoint.x) / 3
      const cp1y = prevPoint.y
      const cp2x = prevPoint.x + (2 * (currPoint.x - prevPoint.x)) / 3
      const cp2y = currPoint.y

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${currPoint.x},${currPoint.y}`
    }

    // Complete the area by drawing to the bottom right, bottom left, and back to start
    path += ` L${points[points.length - 1].x},${chartHeight} L${points[0].x},${chartHeight} Z`

    return path
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}
    >
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Net Savings Trend</h2>
        <select
          className={`text-sm border rounded-md px-2 py-1 cursor-pointer ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>Last 3 months</option>
        </select>
      </div>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>Your savings over time</p>

      <div className="h-[300px] relative" ref={chartRef} onMouseMove={handleMouseMove}>
        <div className="absolute inset-0">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`h-${i}`}
                className={`col-span-6 border-t border-dashed ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              ></div>
            ))}

            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`v-${i}`}
                className={`row-span-5 border-l border-dashed ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              ></div>
            ))}
          </div>

          {/* Y-axis labels */}
          <div
            className={`absolute left-0 top-0 h-full flex flex-col justify-between text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} py-2`}
          >
            <span>$2400</span>
            <span>$1800</span>
            <span>$1200</span>
            <span>$600</span>
            <span>$0</span>
          </div>

          {/* X-axis labels */}
          <div
            className={`absolute bottom-0 left-10 right-0 flex justify-between text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>

          {/* Area chart */}
          <div className="absolute left-10 right-0 top-2 bottom-6">
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <path d={createAreaPath()} fill="rgba(59, 130, 246, 0.3)" stroke="none" />
            </svg>

            {/* Interactive overlay */}
            <div className="absolute inset-0 flex">
              {savingsData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 h-full cursor-pointer"
                  onMouseEnter={() => setHoveredMonth(data.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              ))}
            </div>

            {/* Tooltip */}
            {hoveredMonth && (
              <div
                className={`absolute ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border rounded-md p-2 z-20 pointer-events-none`}
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y - 60}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="font-medium">{hoveredMonth}</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  savings <span className="font-bold">${savingsData.find((d) => d.month === hoveredMonth)?.value}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, amount, change, icon: Icon, darkMode }) => (
  <div
    className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} text-center`}
  >
    <div className="flex items-center justify-between">
      <h2 className="text-md font-semibold">{title}</h2>
      <Icon className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
    </div>
    <p className="text-2xl font-bold mt-2">{amount}</p>
    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{change}</p>
  </div>
)

const BudgetCard = ({ percentage, isOverBudget, darkMode }) => (
  <div
    className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} text-center ${isOverBudget ? "scale-95" : ""}`}
  >
    <div className="flex items-center justify-center">
      <h2 className="text-md font-semibold mr-2">Spent</h2>
      <span className="text-lg">🧾</span>
    </div>
    <p className="text-2xl font-bold mt-2">{percentage}%</p>
    <div className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full h-1.5 mt-2`}>
      <div
        className={`h-1.5 rounded-full ${
          percentage > 80 ? "bg-red-500" : percentage > 60 ? "bg-yellow-500" : "bg-green-500"
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
)

const RecentTransactionsCard = ({
  transactions,
  searchTerm,
  setSearchTerm,
  showAll,
  setShowAll,
  onAdd,
  onEdit,
  onDelete,
  filters,
  handleFilterChange,
  resetFilters,
  showFilters,
  setShowFilters,
  darkMode,
}) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5)

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Your recent financial activity</p>
          </div>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center cursor-pointer hover:bg-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </button>
        </div>

        <div className="flex gap-2 mt-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 ${
              darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
            } rounded-md text-sm flex items-center cursor-pointer`}
          >
            <Filter className="h-4 w-4 mr-1" /> Filter
          </button>
        </div>

        {showFilters && (
          <div
            className={`mb-4 p-3 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Filters</h3>
              <button onClick={resetFilters} className="text-blue-500 text-sm cursor-pointer hover:underline">
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <option value="">All Categories</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investments">Investments</option>
                  <option value="Gifts">Gifts</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={filters.description}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-black"
                  }`}
                  placeholder="Filter by description"
                />
              </div>
              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${
                    darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {displayTransactions.length === 0 ? (
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-4`}>No transactions found</p>
        ) : (
          <ul className="space-y-2">
            {displayTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`flex justify-between py-3 px-2 rounded-md ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                    } mr-3`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs px-2 py-0.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full mr-2`}
                      >
                        {transaction.category}
                      </span>
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={transaction.type === "income" ? "text-green-500" : "text-red-500 font-medium"}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className={`${darkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-500"} cursor-pointer`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className={`${darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"} cursor-pointer`}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {transactions.length > 5 && (
          <button
            className={`w-full text-center py-3 mt-4 border ${
              darkMode
                ? "border-gray-700 text-blue-400 hover:bg-gray-700"
                : "border-gray-200 text-blue-500 hover:bg-gray-50"
            } rounded-md cursor-pointer`}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All Transactions"}
          </button>
        )}
      </div>
    </div>
  )
}

const ExpensesBreakdownCard = ({ data, activeIndex, setActiveIndex, totalExpenses, darkMode }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipData, setTooltipData] = useState(null)
  const chartRef = useRef(null)

  const handleMouseMove = (e) => {
    if (chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  const handlePieEnter = (_, index) => {
    setActiveIndex(index)
    setShowTooltip(true)
    setTooltipData(data[index])
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
    setShowTooltip(false)
    setTooltipData(null)
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {data.length === 0 ? (
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-4`}>No expense data available</p>
      ) : (
        <>
          <div className="h-[220px] mb-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handlePieEnter}
                  onMouseLeave={handlePieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {showTooltip && tooltipData && (
              <div
                className={`absolute ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} border rounded-md p-3 z-20`}
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: "translate(10px, -50%)",
                }}
              >
                <p className="font-medium text-lg" style={{ color: tooltipData.color }}>
                  {tooltipData.name}
                </p>
                <p className="text-md font-semibold">${tooltipData.value.toFixed(2)}</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {((tooltipData.value / totalExpenses) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {data.map((entry, index) => {
              const percentage = ((entry.value / totalExpenses) * 100).toFixed(1)

              return (
                <div
                  key={`legend-${index}`}
                  className={`flex items-center gap-2 cursor-pointer ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } p-1 rounded`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <div>
                    <div className="text-xs font-medium">{entry.name}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{percentage}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage;

