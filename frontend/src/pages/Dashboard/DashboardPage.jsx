import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Home,ArrowUp,ArrowDown,BarChart,Bell,Edit,Trash,Search,Filter,User,ChevronDown,Plus,X,Moon,Sun,DollarSign,Settings,LogOut,} from "lucide-react"

//random just a sample data for now
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

  return (
    <div className="flex">
      {/* navbars */}
      <div className="w-1/5 bg-white p-4 shadow-md min-h-screen">
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
      <div className="w-4/5 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">View your financial overview and recent activity.</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-200 rounded-full" onClick={() => setDarkMode(!darkMode)}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
          <ExpensesBreakdownCard
            data={expenseBreakdownData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            totalExpenses={totalExpenses}
          />
        </div>
      </div>

      {/* add and edit transactions */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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

const Card = ({ title, amount, change, icon: Icon }) => (
  <div className="bg-white p-3 rounded-lg shadow-md text-center">
    <div className="flex items-center justify-between">
      <h2 className="text-md font-semibold">{title}</h2>
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <p className="text-2xl font-bold mt-2">{amount}</p>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
)

const BudgetCard = ({ percentage, isOverBudget }) => (
  <div className={`bg-white p-3 rounded-lg shadow-md text-center ${isOverBudget ? "scale-95" : ""}`}>
    <h2 className="text-md font-semibold">Spent</h2>
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
    <div className="bg-white p-4 rounded-lg shadow-md">
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
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, color } = payload[0].payload
      const percentage = ((value / totalExpenses) * 100).toFixed(1)

      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-medium" style={{ color }}>
            {name}
          </p>
          <p className="text-sm">${value.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No expense data available</p>
      ) : (
        <>
          <div className="h-[200px] mb-4">
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
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                      strokeWidth={activeIndex === index ? 2 : 0}
                      style={{
                        filter: activeIndex === index ? "drop-shadow(0 0 4px rgba(0,0,0,0.3))" : "none",
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.6,
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
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
