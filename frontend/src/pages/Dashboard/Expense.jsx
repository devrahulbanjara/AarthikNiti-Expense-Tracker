"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Calendar,
  ChevronDown,
  Edit,
  Filter,
  MessageCircle,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Trash,
  User,
  Settings,
  Home,
  ArrowUp,
  ArrowDown,
  PieChartIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react"

// Sample data for daily expenses
const dailyExpenseData = [
  { day: "Mon", date: "Mar 14", amount: 45 },
  { day: "Tue", date: "Mar 15", amount: 30 },
  { day: "Wed", date: "Mar 16", amount: 60 },
  { day: "Thu", date: "Mar 17", amount: 25 },
  { day: "Fri", date: "Mar 18", amount: 85 },
  { day: "Sat", date: "Mar 19", amount: 40 },
  { day: "Sun", date: "Mar 20", amount: 55 },
]

// Sample data for category breakdown
const categoryExpenseData = [
  { name: "Food", value: 450, color: "#f97316" },
  { name: "Transportation", value: 300, color: "#8b5cf6" },
  { name: "Housing", value: 800, color: "#06b6d4" },
  { name: "Entertainment", value: 200, color: "#22c55e" },
  { name: "Shopping", value: 250, color: "#ec4899" },
  { name: "Bills", value: 350, color: "#3b82f6" },
]

// Sample expense list
const expenses = [
  {
    id: "1",
    category: "Food",
    amount: 120,
    date: "2025-03-14",
    paymentMethod: "Credit Card",
    description: "Grocery shopping",
  },
  {
    id: "2",
    category: "Transportation",
    amount: 45,
    date: "2025-03-13",
    paymentMethod: "Cash",
    description: "Uber ride",
  },
  {
    id: "3",
    category: "Bills",
    amount: 200,
    date: "2025-03-10",
    paymentMethod: "Bank Transfer",
    description: "Electricity bill",
  },
  {
    id: "4",
    category: "Entertainment",
    amount: 60,
    date: "2025-03-09",
    paymentMethod: "Credit Card",
    description: "Movie tickets",
  },
  {
    id: "5",
    category: "Shopping",
    amount: 85,
    date: "2025-03-07",
    paymentMethod: "Debit Card",
    description: "New t-shirt",
  },
]

// Navigation items
const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: BarChart, href: "/reports" },
  { name: "Budgeting & Alerts", icon: PieChartIcon, href: "/budgeting" },
]

// Accounts
const accounts = [
  { name: "Personal", id: "personal" },
  { name: "Business", id: "business" },
  { name: "Travel", id: "travel" },
  { name: "Other", id: "other" },
]

const Expense = () => {
  const [viewType, setViewType] = useState("daily")
  const [timePeriod, setTimePeriod] = useState("30days")
  const [sortDirection, setSortDirection] = useState("desc")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [expenseList, setExpenseList] = useState(expenses)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeAccount, setActiveAccount] = useState("Personal")
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Calculate totals
  const totalExpense = expenseList.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = totalExpense / expenseList.length

  // Sort expenses by date
  const sortedExpenses = [...expenseList].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA
  })

  // Handle delete expense
  const handleDelete = (id) => {
    setExpenseList(expenseList.filter((expense) => expense.id !== id))
    alert("Expense deleted successfully!")
  }

  // Handle edit expense
  const handleEdit = (id) => {
    alert(`Editing expense with ID: ${id}`)
  }

  // Custom tooltip for daily expenses
  const DailyExpenseTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="font-medium">
            {payload[0].payload.day}, {payload[0].payload.date}
          </p>
          <p className="text-sm">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for category breakdown
  const CategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = categoryExpenseData.reduce((sum, item) => sum + item.value, 0)
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">${data.value.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{((data.value / total) * 100).toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-green-700 text-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-green-600 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/aarthikniti.png" alt="AarthikNiti Logo" width={32} height={32} className="rounded" />
            <span className="text-lg font-semibold">AarthikNiti</span>
          </Link>
          {isMobile && (
            <button
              className="p-2 rounded-md hover:bg-green-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-6">
            <div className="relative">
              <button
                className="flex w-full items-center justify-between rounded-md border border-green-600 bg-green-600 p-2 text-left text-sm font-medium cursor-pointer hover:bg-green-500 transition-colors"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              >
                {activeAccount}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {accountDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-green-600 bg-green-700 shadow-lg">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-green-600 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveAccount(account.name)
                        setAccountDropdownOpen(false)
                      }}
                    >
                      {account.name}
                    </button>
                  ))}
                  <button
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-green-600 transition-colors cursor-pointer border-t border-green-600"
                    onClick={() => {
                      alert("Add new account functionality will be implemented here")
                      setAccountDropdownOpen(false)
                    }}
                  >
                    + Add New Account
                  </button>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-green-600 p-4">
          <div className="flex items-center justify-between">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-200 transition-colors"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-200 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed left-4 top-4 z-40 rounded-md border bg-white p-2 shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
      )}

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
          <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors cursor-pointer"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
                  <div className="p-2 border-b">
                    <p className="text-sm font-medium">User</p>
                    <p className="text-xs text-gray-500">user@example.com</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t p-1">
                    <button
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="grid gap-6 p-4 md:p-6">
          {/* Expense Overview with Toggle */}
          <div className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{viewType === "daily" ? "Daily Expenses" : "Category Breakdown"}</h3>
                <div className="flex rounded-md border">
                  <button
                    className={`px-3 py-1 text-sm ${
                      viewType === "daily" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    } rounded-l-md transition-colors cursor-pointer`}
                    onClick={() => setViewType("daily")}
                  >
                    Daily
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${
                      viewType === "category" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    } rounded-r-md transition-colors cursor-pointer`}
                    onClick={() => setViewType("category")}
                  >
                    Category
                  </button>
                </div>
              </div>

              {viewType === "daily" && (
                <div className="flex rounded-md border">
                  <button
                    className={`px-3 py-1 text-sm ${
                      timePeriod === "7days" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    } transition-colors cursor-pointer`}
                    onClick={() => setTimePeriod("7days")}
                  >
                    7 Days
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${
                      timePeriod === "15days" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    } transition-colors cursor-pointer`}
                    onClick={() => setTimePeriod("15days")}
                  >
                    15 Days
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${
                      timePeriod === "30days" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    } transition-colors cursor-pointer`}
                    onClick={() => setTimePeriod("30days")}
                  >
                    30 Days
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              {viewType === "daily" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <div className="text-sm font-medium text-gray-500">Total Expenses</div>
                      <div className="mt-1 text-2xl font-bold">${totalExpense.toFixed(2)}</div>
                    </div>
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <div className="text-sm font-medium text-gray-500">Average Daily Expense</div>
                      <div className="mt-1 text-2xl font-bold">${averageExpense.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyExpenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip content={<DailyExpenseTooltip />} />
                        <Bar dataKey="amount" name="Daily Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <div className="text-sm font-medium text-gray-500">Total Expenses</div>
                      <div className="mt-1 text-2xl font-bold">
                        ${categoryExpenseData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <div className="text-sm font-medium text-gray-500">Top Category</div>
                      <div className="mt-1 text-2xl font-bold">Housing</div>
                      <div className="text-xs text-gray-500">
                        ${categoryExpenseData[2].value.toFixed(2)} (
                        {(
                          (categoryExpenseData[2].value /
                            categoryExpenseData.reduce((sum, item) => sum + item.value, 0)) *
                          100
                        ).toFixed(1)}
                        %)
                      </div>
                    </div>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryExpenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          {categoryExpenseData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke={entry.color}
                              strokeWidth={activeIndex === index ? 2 : 0}
                              style={{
                                filter: activeIndex === index ? "drop-shadow(0 0 4px rgba(0,0,0,0.3))" : "none",
                                opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                                transition: "opacity 0.2s, filter 0.2s",
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CategoryTooltip />} />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          formatter={(value, entry, index) => {
                            const total = categoryExpenseData.reduce((sum, item) => sum + item.value, 0)
                            return (
                              <span className="text-xs cursor-pointer hover:font-medium transition-all">
                                {value} ({((categoryExpenseData[index].value / total) * 100).toFixed(1)}%)
                              </span>
                            )
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expense List */}
          <div className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between p-4 border-b">
              <h3 className="font-medium">Expense List</h3>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setIsAddExpenseOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Expense
                </button>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-[150px] rounded-md border pl-8 py-1 text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                </div>
                <div className="relative">
                  <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 transition-colors cursor-pointer">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
                <button
                  className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Payment Method</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 font-medium">{expense.category}</td>
                        <td className="px-4 py-2 text-red-600">${expense.amount.toFixed(2)}</td>
                        <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{expense.paymentMethod}</td>
                        <td className="px-4 py-2 max-w-[200px] truncate">{expense.description}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => handleEdit(expense.id)}
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Chatbot Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Add Expense Dialog */}
        {isAddExpenseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md rounded-lg border bg-white shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Add Expense</h3>
                  <button
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setIsAddExpenseOpen(false)}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full rounded-md border px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-shadow">
                      <option value="">Select category</option>
                      <option value="food">Food</option>
                      <option value="transportation">Transportation</option>
                      <option value="housing">Housing</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="shopping">Shopping</option>
                      <option value="bills">Bills</option>
                      <option value="health">Health</option>
                      <option value="education">Education</option>
                      <option value="travel">Travel</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full rounded-md border pl-7 px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="date"
                        className="w-full rounded-md border pl-9 px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-shadow cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <select className="w-full rounded-md border px-3 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-shadow">
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_payment">Mobile Payment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      placeholder="Add a description..."
                      className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-shadow"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="expense-recurring" className="rounded border-gray-300 cursor-pointer" />
                    <label htmlFor="expense-recurring" className="text-sm cursor-pointer">
                      Recurring transaction
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md border hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setIsAddExpenseOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Expense