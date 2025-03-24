"use client"

import { useState, useEffect, useRef } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import {
  Home,
  ArrowUp,
  ArrowDown,
  BarChart,
  Bell,
  Edit,
  Trash,
  Search,
  Filter,
  User,
  ChevronDown,
  Plus,
  X,
  Moon,
  Sun,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react"

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
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: Bell, href: "/budgeting" },
]

const DashboardPage = () => {
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false) // Added for profile dropdown
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // calcutale totals for income and exoenses
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

  // calculate expenses breakdown dataa
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
    // Check if dark mode preference is stored in localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

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

  return (
    <div className="flex dark:bg-gray-900 dark:text-white">
      {/* navbars */}
      <div className="w-1/5 bg-white dark:bg-gray-800 p-4 shadow-md min-h-screen">
        <h2 className="text-xl font-bold mb-4">AarthikNiti</h2>

        <hr className="my-3 border-gray-200" />

        {/* accounts personal and other with +add account */}
        <div className="mb-4 relative account-dropdown-container">
          <div
            className="flex justify-between items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <span>{activeAccount}</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          {showAccountDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-md z-10">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setActiveAccount(account.name)
                    setShowAccountDropdown(false)
                  }}
                >
                  {account.name}
                </div>
              ))}
              <div className="p-2 border-t hover:bg-gray-100 cursor-pointer text-blue-500">+ Add Account</div>
            </div>
          )}
        </div>

        <hr className="my-3 border-gray-200" />

        {/* navigation nab bars  */}
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`flex items-center py-2 px-4 rounded-md mb-1 ${
                  item.name === "Dashboard" ? "bg-gray-200" : "hover:bg-gray-100"
                } cursor-pointer`}
              >
                <item.icon className="mr-2 h-4 w-4 text-gray-600" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* main content dashboard  */}
      <div className="w-4/5 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">View your financial overview and recent activity.</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* profile button with dropdown */}
            <div className="relative profile-dropdown-container">
              <button
                className="p-2 bg-gray-200 rounded-full"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <User className="h-5 w-5 text-gray-600" />
              </button>

              {/* prodile dropdown menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Profile
                  </a>
                  <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2 text-gray-500" />
                    Settings
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => alert("Logged out successfully!")}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
            />
          </div>
          <div className="md:col-span-3 h-full">
            <ExpensesBreakdownCard
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
            <UpcomingBillsCard />
          </div>
          <div className="md:col-span-6 h-full">
            <NetSavingsTrendCard />
          </div>
        </div>
      </div>

      {/* add and edit transactions */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <div className="flex">
                  <button
                    type="button"
                    className={`flex-1 py-2 ${newTransaction.type === "income" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-l-md cursor-pointer`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 ${newTransaction.type === "expense" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded-r-md cursor-pointer`}
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md cursor-pointer"
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

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-7 border rounded-md"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md cursor-pointer"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Update the UpcomingBillsCard component to add dropdown menu for the three dots
const UpcomingBillsCard = () => {
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
      <h2 className="text-lg font-semibold mb-1">Upcoming Bills</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Bills due in the next 30 days</p>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <h3 className="font-medium">{bill.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{bill.category}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Due {bill.dueIn}</div>
              <div className="font-semibold">${bill.amount.toFixed(2)}</div>
              <div className="flex items-center">
                <button
                  onClick={() => togglePaid(bill.id)}
                  className={`w-10 h-5 rounded-full ${bill.paid ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"} relative`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all ${bill.paid ? "left-5" : "left-1"}`}
                  ></div>
                </button>
              </div>
              <div className="relative">
                <button className="text-gray-400" onClick={() => toggleDropdown(bill.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === bill.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600"
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
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600"
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
const NetSavingsTrendCard = () => {
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold">Net Savings Trend</h2>
        <select className="text-sm border rounded-md px-2 py-1 dark:bg-gray-700 dark:border-gray-600">
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>Last 3 months</option>
        </select>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Your savings over time</p>

      <div className="h-[300px] relative" ref={chartRef} onMouseMove={handleMouseMove}>
        <div className="absolute inset-0">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={`h-${i}`}
                className="col-span-6 border-t border-dashed border-gray-200 dark:border-gray-700"
              ></div>
            ))}

            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={`v-${i}`}
                className="row-span-5 border-l border-dashed border-gray-200 dark:border-gray-700"
              ></div>
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2">
            <span>$2400</span>
            <span>$1800</span>
            <span>$1200</span>
            <span>$600</span>
            <span>$0</span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>

          {/* Area chart */}
          <div className="absolute left-10 right-0 top-2 bottom-6">
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <path d={createAreaPath()} fill="rgba(156, 163, 175, 0.3)" stroke="none" />
            </svg>

            {/* Interactive overlay */}
            <div className="absolute inset-0 flex">
              {savingsData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 h-full"
                  onMouseEnter={() => setHoveredMonth(data.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              ))}
            </div>

            {/* Tooltip */}
            {hoveredMonth && (
              <div
                className="absolute bg-white dark:bg-gray-700 shadow-lg rounded-md p-2 z-20 pointer-events-none"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y - 60}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="font-medium">{hoveredMonth}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
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

const Card = ({ title, amount, change, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center">
    <div className="flex items-center justify-between">
      <h2 className="text-md font-semibold">{title}</h2>
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <p className="text-2xl font-bold mt-2">{amount}</p>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
)

const BudgetCard = ({ percentage, isOverBudget }) => (
  <div className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-center ${isOverBudget ? "scale-95" : ""}`}>
    <div className="flex items-center justify-center">
      <h2 className="text-md font-semibold mr-2">Spent</h2>
      <span className="text-lg">🧾</span>
    </div>
    <p className="text-2xl font-bold mt-2">{percentage}%</p>
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
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
}) => {
  const displayTransactions = showAll ? transactions : transactions.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm flex items-center cursor-pointer hover:bg-blue-600"
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2 py-1 border rounded-md text-sm"
            />
            <Search className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1 bg-gray-200 rounded-md text-sm flex items-center cursor-pointer hover:bg-gray-300"
          >
            <Filter className="h-3 w-3 mr-1" /> Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Filters</h3>
            <button onClick={resetFilters} className="text-blue-500 text-sm cursor-pointer hover:underline">
              Reset
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-1.5 border rounded-md text-sm cursor-pointer"
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
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                className="w-full p-1.5 border rounded-md text-sm"
                placeholder="Filter by description"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full p-1.5 border rounded-md text-sm cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full p-1.5 border rounded-md text-sm cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {displayTransactions.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No transactions found</p>
      ) : (
        <ul>
          {displayTransactions.map((transaction) => (
            <li key={transaction.id} className="flex justify-between py-2 border-b hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${transaction.type === "income" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
                <div>
                  <div className="font-medium">{transaction.category}</div>
                  <div className="text-sm text-gray-500">{transaction.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-gray-500 hover:text-blue-500 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
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
        <button className="text-blue-500 mt-4 hover:underline cursor-pointer" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "View All Transactions"}
        </button>
      )}
    </div>
  )
}

const ExpensesBreakdownCard = ({ data, activeIndex, setActiveIndex, totalExpenses }) => {
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
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md h-full"
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No expense data available</p>
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
                className="absolute bg-white dark:bg-gray-700 shadow-lg rounded-md p-3 z-20 border border-gray-200"
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
                <p className="text-sm text-gray-500">{((tooltipData.value / totalExpenses) * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {data.map((entry, index) => {
              const percentage = ((entry.value / totalExpenses) * 100).toFixed(1)

              return (
                <div
                  key={`legend-${index}`}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <div>
                    <div className="text-xs font-medium">{entry.name}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
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

export default DashboardPage

