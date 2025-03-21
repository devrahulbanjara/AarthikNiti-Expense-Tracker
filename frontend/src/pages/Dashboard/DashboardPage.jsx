import { useState, useRef, useEffect } from "react";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  Moon,
  PieChart,
  Plus,
  Settings,
  Sun,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import girlImg from "../../assets/ExtraImg/girl.jpg";

export default function DashboardPage() {
  const [accountType, setAccountType] = useState("Personal");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  const accountDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setShowAccountDropdown(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Static data for the expense tracker
  const accounts = {
    Personal: { balance: 5840.25, spent: 1240.75, budget: 3000 },
    Business: { balance: 12450.8, spent: 4320.45, budget: 8000 },
    Travel: { balance: 2100.5, spent: 850.25, budget: 1500 },
    Others: { balance: 750.3, spent: 320.1, budget: 1000 },
  };

  const recentTransactions = [
    {
      id: 1,
      name: "Grocery Shopping",
      category: "Food",
      amount: -85.2,
      date: "2025-03-20",
    },
    {
      id: 2,
      name: "Salary Deposit",
      category: "Income",
      amount: 3200.0,
      date: "2025-03-15",
    },
    {
      id: 3,
      name: "Electric Bill",
      category: "Utilities",
      amount: -120.5,
      date: "2025-03-12",
    },
    {
      id: 4,
      name: "Freelance Payment",
      category: "Income",
      amount: 450.0,
      date: "2025-03-10",
    },
    {
      id: 5,
      name: "Restaurant Dinner",
      category: "Food",
      amount: -65.8,
      date: "2025-03-08",
    },
    {
      id: 6,
      name: "Gym Membership",
      category: "Health",
      amount: -49.99,
      date: "2025-03-05",
    },
  ];

  const upcomingBills = [
    { id: 1, name: "Rent Payment", amount: 1200.0, dueDate: "2025-04-01" },
    { id: 2, name: "Internet Bill", amount: 59.99, dueDate: "2025-03-25" },
    { id: 3, name: "Phone Bill", amount: 45.5, dueDate: "2025-03-28" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAccountChange = (account) => {
    setAccountType(account);
    setShowAccountDropdown(false);
  };

  const selectedAccount = accounts[accountType];
  const spentPercentage =
    (selectedAccount.spent / selectedAccount.budget) * 100;

  return (
    <div className={`min-h-screen`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transition-transform duration-300 md:static md:translate-x-0 ${
            sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ExpenseTrack
              </h1>
            </div>
            {isMobile && (
              <button
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </button>
            )}
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <BarChart3 className="h-5 w-5" />
                Analytics
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <CreditCard className="h-5 w-5" />
                Accounts
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <PieChart className="h-5 w-5" />
                Budgets
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="h-5 w-5" />
                Settings
              </a>
            </div>
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Rahul Banjara the Coder
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rahul_the_bestCoder@gmail.com
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 md:px-6">
            {isMobile && (
              <button
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="relative" ref={accountDropdownRef}>
                <button
                  className="flex w-[180px] items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                >
                  <span>{accountType} Account</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showAccountDropdown && (
                  <div className="absolute mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-lg">
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleAccountChange("Personal")}
                    >
                      Personal Account
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleAccountChange("Business")}
                    >
                      Business Account
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleAccountChange("Travel")}
                    >
                      Travel Account
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleAccountChange("Others")}
                    >
                      Other Accounts
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={userDropdownRef}>
                <button
                  className="rounded-full"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={girlImg}
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-lg">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        My Account
                      </p>
                    </div>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </button>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Balance
                  </h3>
                  <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    ${selectedAccount.balance.toFixed(2)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    +2.5% from last month
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Monthly Spent
                  </h3>
                  <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    ${selectedAccount.spent.toFixed(2)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {(
                      (selectedAccount.spent / selectedAccount.budget) *
                      100
                    ).toFixed(1)}
                    % of monthly budget
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Monthly Budget
                  </h3>
                  <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    ${selectedAccount.budget.toFixed(2)}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    $
                    {(selectedAccount.budget - selectedAccount.spent).toFixed(
                      2
                    )}{" "}
                    remaining
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Budget Progress
                  </h3>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                      style={{ width: `${spentPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>${selectedAccount.spent.toFixed(2)} spent</span>
                    <span>${selectedAccount.budget.toFixed(2)} budget</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-1">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "transactions"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("transactions")}
                  >
                    Recent Transactions
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "upcoming"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming Bills
                  </button>
                </div>
                <button className="flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </button>
              </div>

              <div className="mt-4">
                {activeTab === "transactions" && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Recent Transactions
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Your recent financial activity across all accounts.
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`rounded-full p-2 ${
                                  transaction.amount > 0
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {transaction.amount > 0 ? (
                                  <DollarSign className="h-4 w-4" />
                                ) : (
                                  <CreditCard className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {transaction.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {transaction.date}
                                  </p>
                                  <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                                    {transaction.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p
                              className={`font-medium ${
                                transaction.amount > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "upcoming" && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Upcoming Bills
                      </h2>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Bills and payments due in the next 30 days.
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {upcomingBills.map((bill) => (
                          <div
                            key={bill.id}
                            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {bill.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Due: {bill.dueDate}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              ${bill.amount.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Spending by Category
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your spending breakdown for the current month.
                  </p>
                </div>
                <div className="flex h-[200px] items-center justify-center p-6">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <PieChart className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow">
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Monthly Overview
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Income vs. expenses for the last 6 months.
                  </p>
                </div>
                <div className="flex h-[200px] items-center justify-center p-6">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Chart visualization will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
