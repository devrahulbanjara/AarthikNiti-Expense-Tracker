import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, ChevronDown, FileText, Home, LogOut, Menu, Plus, Search, Settings, User, X, Edit, Trash, StickyNoteIcon as NoteIcon } from 'lucide-react'
import logo from "../../assets/Logo/aarthikniti.png";

const transactions = [
  { id: 1, type: "income", amount: 2500, category: "Salary", description: "Monthly salary", date: "2025-03-15" },
  { id: 2, type: "expense", amount: 120, category: "Food", description: "Grocery shopping", date: "2025-03-14" },
  { id: 3, type: "expense", amount: 45, category: "Transportation", description: "Uber ride", date: "2025-03-13" },
  { id: 4, type: "expense", amount: 200, category: "Bills", description: "Electricity bill", date: "2025-03-10" },
]

const expenseData = [
  { name: "Food", value: 450, color: "#f97316" },
  { name: "Transportation", value: 300, color: "#8b5cf6" },
  { name: "Housing", value: 800, color: "#06b6d4" },
  { name: "Entertainment", value: 200, color: "#22c55e" },
  { name: "Shopping", value: 250, color: "#ec4899" },
  { name: "Bills", value: 350, color: "#3b82f6" },
]

const accounts = [
  { name: "Personal", id: "personal" },
  { name: "Business", id: "business" },
  { name: "Travel", id: "travel" },
  { name: "Other", id: "other" },
]

const navItems = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Income", icon: ArrowUp, href: "/income" },
  { name: "Expenses", icon: ArrowDown, href: "/expenses" },
  { name: "Reports", icon: NoteIcon, href: "/reports" },
  { name: "Budgeting & Alerts", icon: FileText, href: "/budgeting" },
]

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeAccount, setActiveAccount] = useState("Personal")
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("income")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false)
  const [transactionList, setTransactionList] = useState(transactions)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {isMobile && sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-green-700 text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-green-600 px-4">
        <Link to="/" className="flex items-center gap-2">
        <img src="/aarthikniti.png" alt="Logo" width={32} height={32} className="logo" />
        <span className="text-lg font-semibold">Aarthik Niti</span>
        </Link>

          {isMobile && <button className="p-2 rounded-md hover:bg-green-600 cursor-pointer" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <div className="px-4 mb-6">
            <button className="flex w-full items-center justify-between rounded-md border border-green-600 bg-green-600 p-2 text-left text-sm font-medium cursor-pointer" onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}>
              {activeAccount}<ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {accountDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-green-600 bg-green-700 shadow-lg">
                {accounts.map(a => <button key={a.id} className="block w-full px-4 py-2 text-left text-sm hover:bg-green-600 cursor-pointer" onClick={() => {setActiveAccount(a.name); setAccountDropdownOpen(false)}}>{a.name}</button>)}
                <button className="block w-full px-4 py-2 text-left text-sm hover:bg-green-600 border-t border-green-600 cursor-pointer" onClick={() => setAccountDropdownOpen(false)}>+ Add New Account</button>
              </div>
            )}
          </div>

          <nav className="space-y-1 px-2">
            {navItems.map(item => (
              <Link key={item.name} to={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-green-600 cursor-pointer">
                <item.icon className="h-5 w-5" />{item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-green-600 p-4">
          <div className="flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium cursor-pointer"><User className="h-5 w-5" />Profile</Link>
            <Link to="/settings" className="flex items-center gap-2 text-sm font-medium cursor-pointer"><Settings className="h-5 w-5" />Settings</Link>
          </div>
          <div className="mt-4">
            <button className="flex items-center gap-2 text-sm font-medium text-red-300 hover:text-red-200 cursor-pointer"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </div>
      </div>

      {isMobile && !sidebarOpen && (
        <button className="fixed left-4 top-4 z-40 rounded-md border bg-white p-2 shadow-md cursor-pointer" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
      )}

      <div className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "ml-0 md:ml-64" : "ml-0"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          <div className="relative">
            <button className="flex items-center gap-2 rounded-full cursor-pointer" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
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
                  <Link to="/profile" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => setProfileDropdownOpen(false)}>
                    <User className="h-4 w-4 text-gray-500" />Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => setProfileDropdownOpen(false)}>
                    <Settings className="h-4 w-4 text-gray-500" />Settings
                  </Link>
                </div>
                <div className="border-t p-1">
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer" onClick={() => setProfileDropdownOpen(false)}>
                    <LogOut className="h-4 w-4" />Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="grid gap-6 p-4 md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Transactions */}
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Recent Transactions</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => setIsAddTransactionOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input type="search" placeholder="Search..." className="w-[150px] rounded-md border pl-8 py-1 text-sm" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {transactionList.slice(0, showAllTransactions ? undefined : 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.type === "income" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                          {t.type === "income" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.category}</p>
                          <p className="text-xs text-gray-500">{t.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className={`text-sm font-medium ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex">
                          <button className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setIsAddTransactionOpen(true)}>
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setTransactionList(transactionList.filter(item => item.id !== t.id))}>
                            <Trash className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="flex items-center gap-1 mx-auto text-sm text-blue-600 hover:text-blue-700 cursor-pointer" onClick={() => setShowAllTransactions(!showAllTransactions)}>
                    {showAllTransactions ? "Show Less" : "View All Transactions"}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showAllTransactions ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-medium">Expenses Breakdown</h3>
              </div>
              <div className="p-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const total = expenseData.reduce((sum, item) => sum + item.value, 0)
                          return (
                            <div className="rounded-lg border bg-white p-2 shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">${data.value.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{((data.value / total) * 100).toFixed(1)}%</p>
                            </div>
                          )
                        }
                        return null
                      }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {expenseData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {isAddTransactionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md rounded-lg border bg-white shadow-lg">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Add Transaction</h3>
                  <button className="p-1 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => setIsAddTransactionOpen(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex rounded-md border mb-4">
                  <button className={`flex-1 px-4 py-2 text-sm ${transactionType === "income" ? "bg-blue-600 text-white" : "hover:bg-gray-100"} rounded-l-md cursor-pointer`} onClick={() => setTransactionType("income")}>Income</button>
                  <button className={`flex-1 px-4 py-2 text-sm ${transactionType === "expense" ? "bg-blue-600 text-white" : "hover:bg-gray-100"} rounded-r-md cursor-pointer`} onClick={() => setTransactionType("expense")}>Expense</button>
                </div>
                <form onSubmit={(e) => {e.preventDefault(); setIsAddTransactionOpen(false)}} className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full rounded-md border px-3 py-2 cursor-pointer">
                      <option value="">Select category</option>
                      {(transactionType === "income" ? ["Salary", "Freelance", "Investments", "Gifts", "Other"] : ["Food", "Transportation", "Housing", "Entertainment", "Shopping", "Bills", "Health", "Education", "Travel", "Other"]).map(cat => (
                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input type="number" step="0.01" min="0" placeholder="0.00" className="w-full rounded-md border pl-7 px-3 py-2" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Date</label>
                    <input type="date" className="w-full rounded-md border px-3 py-2 cursor-pointer" />
                  </div>
                  {transactionType === "expense" && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Payment Method</label>
                      <select className="w-full rounded-md border px-3 py-2 cursor-pointer">
                        <option value="">Select payment method</option>
                        {["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Payment", "Other"].map(method => (
                          <option key={method} value={method.toLowerCase().replace(" ", "_")}>{method}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea placeholder="Add a description..." className="w-full rounded-md border px-3 py-2" rows={3} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`${transactionType}-recurring`} className="rounded border-gray-300 cursor-pointer" />
                    <label htmlFor={`${transactionType}-recurring`} className="text-sm cursor-pointer">Recurring transaction</label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button type="button" className="px-4 py-2 rounded-md border hover:bg-gray-100 cursor-pointer" onClick={() => setIsAddTransactionOpen(false)}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">Add Transaction</button>
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

export default DashboardPage;
