import { expenseCategories } from "./expenseCategories";

const AddExpenseModal = ({ darkMode, showAddModal, setShowAddModal, newExpense, setNewExpense, handleAddExpense }) => {
  if (!showAddModal) return null;

  const inputClass = `w-full p-2 border rounded-md ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`;
  const labelClass = `block text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-1`;

  const handleChange = (field) => (e) => {
    setNewExpense({ ...newExpense, [field]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <p className="text-sm text-gray-500 mb-4">Enter the details of your expense</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Category*</label>
            <select value={newExpense.category} onChange={handleChange('category')} className={inputClass} required>
              <option value="">Select category</option>
              {expenseCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Amount*</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <input
                type="number"
                value={newExpense.amount}
                onChange={handleChange('amount')}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Date*</label>
            <input type="date" value={newExpense.date} onChange={handleChange('date')} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Payment Method*</label>
            <select value={newExpense.paymentMethod} onChange={handleChange('paymentMethod')} className={inputClass} required>
              <option value="">Select method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Payment">Mobile Payment</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={newExpense.description}
            onChange={handleChange('description')}
            placeholder="Enter description"
            className={inputClass}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRecurring"
              checked={newExpense.isRecurring}
              onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isRecurring" className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Recurring Expense</label>
          </div>

          {newExpense.isRecurring && (
            <div className="mt-2">
              <label className={labelClass}>Recurring Period</label>
              <select value={newExpense.recurringPeriod} onChange={handleChange('recurringPeriod')} className={inputClass}>
                <option value="1 day">Daily</option>
                <option value="1 week">Weekly</option>
                <option value="1 month">Monthly</option>
                <option value="2 months">Every 2 Months</option>
                <option value="3 months">Every 3 Months</option>
                <option value="6 months">Every 6 Months</option>
                <option value="1 year">Yearly</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowAddModal(false)} className={`px-4 py-2 rounded-md ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}>
            Cancel
          </button>
          <button onClick={handleAddExpense} className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md">
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;