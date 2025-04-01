import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash, Plus, ArrowUp, ArrowDown, X } from "lucide-react";
import { expenseCategories } from "./Expense";

const RecentTransactions = ({ darkMode, onTransactionsChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [filters, setFilters] = useState({
    category: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchTransactionsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/profile/recent_transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      const formattedTransactions = data.map((transaction) => ({
        id: transaction._id,
        type: transaction.transaction_type,
        amount: transaction.transaction_amount,
        category: transaction.transaction_category,
        description: transaction.transaction_description,
        date: new Date(transaction.timestamp).toISOString().split("T")[0],
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/profile/recent_transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      await fetchTransactionsData(); // Refresh transactions after adding
      if (onTransactionsChange) onTransactionsChange();
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionToAdd = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      ...newTransaction,
      amount: Number.parseFloat(newTransaction.amount),
    };

    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? transactionToAdd : t)));
    } else {
      const success = await addTransaction(transactionToAdd);
      if (success) {
        setTransactions([...transactions, transactionToAdd]);
      }
    }

    resetModal();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ category: "", dateFrom: "", dateTo: "", description: "" });

  const resetModal = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    setNewTransaction({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    return (
      (!searchTerm || t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.dateFrom || new Date(filters.dateFrom) <= new Date(t.date)) &&
      (!filters.dateTo || new Date(filters.dateTo) >= new Date(t.date)) &&
      (!filters.description || t.description.toLowerCase().includes(filters.description.toLowerCase()))
    );
  });

  useEffect(() => {
    fetchTransactionsData();
    const intervalId = setInterval(fetchTransactionsData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isAddModalOpen) resetModal();
  }, [isAddModalOpen]);

  const displayTransactions = showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 5);

  return (
    <>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-300"} h-full`}>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <div>
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Your recent financial activity</p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center cursor-pointer hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" /> Add
            </button>
          </div>

          <div className="flex gap-2 mt-4 mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black"}`}
              />
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-black"} rounded-md text-sm flex items-center cursor-pointer`}>
              <Filter className="h-4 w-4 mr-1" /> Filter
            </button>
          </div>

          {showFilters && (
            <div className={`mb-4 p-3 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Filters</h3>
                <button onClick={resetFilters} className="text-blue-500 text-sm cursor-pointer hover:underline">Reset</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["category", "description", "dateFrom", "dateTo"].map((filter, index) => (
                  <div key={index}>
                    <label className={`block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    {filter === "category" ? (
                      <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                      >
                        <option value="">All Categories</option>
                        {expenseCategories.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={filter.includes("date") ? "date" : "text"}
                        name={filter}
                        value={filters[filter]}
                        onChange={handleFilterChange}
                        className={`w-full p-1.5 border rounded-md text-sm cursor-pointer ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                        placeholder={filter === "description" ? "Filter by description" : ""}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : displayTransactions.length === 0 ? (
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-500"} py-4`}>No transactions found</p>
          ) : (
            <ul className="space-y-2">
              {displayTransactions.map((transaction) => (
                <li key={transaction.id} className={`flex justify-between py-3 px-2 rounded-md ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} cursor-pointer`}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"} mr-3`}>
                      {transaction.type === "income" ? <ArrowUp className="h-5 w-5 text-green-500" /> : <ArrowDown className="h-5 w-5 text-red-500" />}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-0.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full mr-2`}>
                          {transaction.category}
                        </span>
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-right ${transaction.type === "income" ? "text-green-500" : "text-red-500 font-medium"}`}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(transaction)} className={`cursor-pointer ${darkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-500"}`}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(transaction.id)} className={`cursor-pointer ${darkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}>
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filteredTransactions.length > 5 && (
            <button
              className={`w-full text-center py-3 mt-4 border ${darkMode ? "border-gray-700 text-blue-400 hover:bg-gray-700" : "border-gray-200 text-blue-500 hover:bg-gray-50"} rounded-md cursor-pointer`}
              onClick={() => setShowAllTransactions(!showAllTransactions)}
            >
              {showAllTransactions ? "Show Less" : "View All Transactions"}
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
          <div className={`relative bg-white p-6 rounded-lg w-full max-w-md shadow-xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
              <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={resetModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Type</label>
                <div className="flex rounded-md overflow-hidden">
                  {["income", "expense"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 py-3 ${newTransaction.type === type ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"} cursor-pointer transition-colors`}
                      onClick={() => setNewTransaction({ ...newTransaction, type })}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md cursor-pointer appearance-none bg-white"
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

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-7 border border-gray-300 rounded-md"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Transaction description"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md cursor-pointer"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" className="px-5 py-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 font-medium" onClick={resetModal}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 font-medium">
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentTransactions;