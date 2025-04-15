// AddIncome.js
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AddIncome = ({
  isOpen,
  onClose,
  onSubmit,
  editingIncome,
  incomeSources,
}) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    id: null,
    source: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingIncome) {
      setFormData({
        ...editingIncome,
        source: editingIncome.category || editingIncome.source,
        amount: editingIncome.amount.toString(),
      });
    } else {
      setFormData({
        id: Date.now(),
        source: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [editingIncome, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source) {
      newErrors.source = "Income source is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (
      isNaN(formData.amount) ||
      Number.parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submissionData = {
      category: formData.source,
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
    };

    onSubmit(submissionData, !!editingIncome);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
      <div
        className={`${
          darkMode
            ? "bg-gray-800 text-white bg-opacity-95"
            : "bg-white text-gray-800 bg-opacity-95"
        } rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {editingIncome ? "Edit Income" : "Add New Income"}
          </h2>
          <button
            onClick={onClose}
            className={`${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } p-2 rounded-full transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Income Source*
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
              >
                <option value="">Select a source</option>
                {incomeSources.map((source) => (
                  <option key={source.name} value={source.name}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount*</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#065336] hover:bg-[#054328] text-white rounded-lg transition-colors"
            >
              {editingIncome ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
