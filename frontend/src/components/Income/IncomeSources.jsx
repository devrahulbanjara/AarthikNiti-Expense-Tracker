"use client"

import { useState } from "react"
import { Search, Filter, Edit, Trash2 } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const IncomeSources = ({ incomes, incomeSources, onEdit, onDelete, formatDate, totalIncome }) => {
  const { darkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    source: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => setFilters({ source: "", dateFrom: "", dateTo: "", description: "" })

  // Filter incomes based on search and filters
  const filteredIncomes = incomes.filter((income) => {
    return (
      (!searchTerm ||
        income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.source.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filters.source || income.source === filters.source) &&
      (!filters.dateFrom || new Date(filters.dateFrom) <= new Date(income.date)) &&
      (!filters.dateTo || new Date(filters.dateTo) >= new Date(income.date)) &&
      (!filters.description || income.description.toLowerCase().includes(filters.description.toLowerCase()))
    )
  })

  return (
    <div
      className={`${darkMode ? "bg-[#111827]" : "bg-white"} rounded-lg border ${darkMode ? "border-gray-800" : "border-gray-200"} transition-colors duration-300`}
    >
      <div className={`p-4 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div>
          <h2 className="text-xl font-bold">Income Sources</h2>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm mt-1`}>
          Manage and track all your income sources
        </p>
      </div>

      {/* Search and Filter */}
      <div className={`p-4 border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search income sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-[#1f2937] border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border flex items-center ${
              darkMode ? "bg-[#1f2937] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"
            } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300`}
          >
            <Filter size={18} className="mr-2" />
            Filters {showFilters ? "▲" : "▼"}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Source
              </label>
              <select
                name="source"
                value={filters.source}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? "bg-[#1f2937] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
              >
                <option value="">All Sources</option>
                {incomeSources.map((source) => (
                  <option key={source.name} value={source.name}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? "bg-[#1f2937] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? "bg-[#1f2937] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Description
              </label>
              <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleFilterChange}
                placeholder="Filter by description"
                className={`w-full p-2 rounded-lg border ${
                  darkMode
                    ? "bg-[#1f2937] border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-[#065336] transition-colors duration-300`}
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-[#065336] hover:text-[#054328] dark:text-[#2a9d6e] dark:hover:text-[#3cb485]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Income List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className={`${darkMode ? "bg-[#1f2937]" : "bg-gray-50"} border-b ${darkMode ? "border-gray-800" : "border-gray-200"}`}
          >
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Recurring</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? "divide-gray-800" : "divide-gray-200"}`}>
            {filteredIncomes.length > 0 ? (
              filteredIncomes.map((income) => (
                <tr
                  key={income.id}
                  className={`${darkMode ? "hover:bg-[#1f2937]" : "hover:bg-gray-50"} transition-colors duration-300`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: incomeSources.find((s) => s.name === income.source)?.color || "#6b7280",
                        }}
                      ></div>
                      <span>{income.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-500 font-medium">
                    +${income.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{income.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(income.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {income.recurring ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f0eb] text-[#065336] dark:bg-[#0a3b27] dark:text-[#a3e0c5]">
                        Recurring
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        One-time
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(income)}
                      className="text-[#065336] hover:text-[#054328] dark:text-[#2a9d6e] dark:hover:text-[#3cb485] mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(income.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No income sources found. Add your first income source!
                </td>
              </tr>
            )}
          </tbody>
          <tfoot
            className={`${darkMode ? "bg-[#1f2937]" : "bg-gray-50"} border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}
          >
            <tr>
              <td className="px-6 py-3 text-left font-bold">Total</td>
              <td className="px-6 py-3 text-left font-bold text-black">+${totalIncome.toFixed(2)}</td>
              <td colSpan="4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default IncomeSources;