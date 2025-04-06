import DailyExpensesChart from "./DailyExpensesChart"
import CategoryBreakdownChart from "./CategoryBreakdownChart"

const ExpenseOverview = ({
  darkMode,
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  dailyExpensesData,
  categoryBreakdownData,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} mb-6`}
      style={{ minHeight: "500px" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`border rounded-md px-3 py-1 cursor-pointer ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
          }`}
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last 6 months</option>
          <option>This year</option>
        </select>
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("Daily Expenses")}
          className={`px-4 py-2 rounded-tl-md rounded-bl-md cursor-pointer hover:opacity-80 active:scale-95 transition-all ${
            activeTab === "Daily Expenses"
              ? darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
              : darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          Daily Expenses
        </button>
        <button
          onClick={() => setActiveTab("Category Breakdown")}
          className={`px-4 py-2 rounded-tr-md rounded-br-md cursor-pointer hover:opacity-80 active:scale-95 transition-all ${
            activeTab === "Category Breakdown"
              ? darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
              : darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          Category Breakdown
        </button>
      </div>

      <div className="h-[400px]">
        {activeTab === "Daily Expenses" ? (
          <DailyExpensesChart darkMode={darkMode} data={dailyExpensesData} />
        ) : (
          <CategoryBreakdownChart darkMode={darkMode} data={categoryBreakdownData} />
        )}
      </div>
    </div>
  )
}

export default ExpenseOverview;