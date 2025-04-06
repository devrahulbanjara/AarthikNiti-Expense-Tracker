import { Moon, Sun } from "lucide-react"

const DarkMode = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      className={`p-2 ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300"} rounded-full cursor-pointer`}
      onClick={toggleDarkMode}
    >
      {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
    </button>
  )
}

export default DarkMode;