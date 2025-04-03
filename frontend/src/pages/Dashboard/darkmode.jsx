"use client"

import { Moon, Sun } from "lucide-react"

const DarkMode = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      className={`p-2 rounded-full transition-colors duration-300 ${
        darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
      }`}
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export default DarkMode

