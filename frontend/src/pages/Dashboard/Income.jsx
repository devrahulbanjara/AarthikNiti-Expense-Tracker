import { useState } from "react";
import { FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";

const AddIncomeModal = ({ onClose }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIncome({
      ...income,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Income Data:", income);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold">Add Income</h2>
            <p className="text-gray-500 text-sm">Enter the details of your income</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <select
              name="source"
              value={income.source}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="">Select source</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="flex items-center border rounded p-2">
              <span className="text-gray-500 pr-2">$</span>
              <input
                type="number"
                name="amount"
                value={income.amount}
                onChange={handleChange}
                className="w-full focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={income.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={income.description}
              onChange={handleChange}
              className="w-full p-2 border rounded resize-none"
              placeholder="Enter income details"
            />
          </div>

          <div className="mb-3 flex items-center gap-2 border p-3 rounded">
            <input
              type="checkbox"
              name="recurring"
              checked={income.recurring}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <div>
              <p className="text-sm font-medium">Recurring Income</p>
              <p className="text-xs text-gray-500">This income repeats regularly</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Income
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white h-screen w-64 p-4 fixed transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white text-lg">
            <FaTimes />
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li className="hover:bg-gray-700 p-2 rounded"><a href="#">Home</a></li>
            <li className="hover:bg-gray-700 p-2 rounded"><a href="#">Income</a></li>
            <li className="hover:bg-gray-700 p-2 rounded"><a href="#">Expenses</a></li>
            <li className="hover:bg-gray-700 p-2 rounded"><a href="#">Reports</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 p-6 ml-64">
        {/* Sidebar Toggle */}
        <button onClick={() => setIsSidebarOpen(true)} className="mb-4 text-gray-700 text-2xl">
          <FaBars />
        </button>

        {/* Add Income Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Income
        </button>

        {/* Show Modal */}
        {isModalOpen && <AddIncomeModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
};

export default App;
