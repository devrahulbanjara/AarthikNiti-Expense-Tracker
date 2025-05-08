"use client";

import { Plus } from "lucide-react";

const AddExpenseButton = ({ setShowAddModal }) => (
  <div className="flex justify-end mb-4">
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
    >
      <Plus className="h-5 w-5" />
      Add Expense
    </button>
  </div>
);

export default AddExpenseButton;
