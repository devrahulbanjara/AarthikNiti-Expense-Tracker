import { Plus } from 'lucide-react';

const AddExpenseButton = ({ setShowAddModal }) => (
  <div className="flex justify-end mb-4">
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
    >
      <Plus className="h-5 w-5" />
      Add Expense
    </button>
  </div>
);

export default AddExpenseButton;