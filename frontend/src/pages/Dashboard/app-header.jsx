import ProfileDropdown from "./profile-dropdown"
import DarkModeToggle from "./dark-mode-toggle"

const AppHeader = ({ darkMode, toggleDarkMode, handleLogout, scrolled }) => {
  return (
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
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <ProfileDropdown darkMode={darkMode} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  )
}

export default AppHeader

