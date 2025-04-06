import DarkMode from "./darkmode"
import ProfileDropdown from "./profile-dropdown"

const ExpenseHeader = ({ darkMode, toggleDarkMode, handleLogout, scrolled }) => {
  return (
    <div
      className={`fixed top-0 left-1/5 right-0 ${darkMode ? "bg-gray-900" : "bg-white"} z-30 p-6 transition-all duration-300 ${scrolled ? `${darkMode ? "bg-opacity-80" : "bg-opacity-90"} backdrop-blur-sm border-b ${darkMode ? "border-gray-700" : "border-gray-200"}` : "bg-opacity-100"}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <div className="h-1 w-20 mt-1 mb-2"></div>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage your expenses and track your spending.
          </p>
        </div>
        <div className="flex space-x-4">
          <DarkMode darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <ProfileDropdown darkMode={darkMode} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  )
}

export default ExpenseHeader;