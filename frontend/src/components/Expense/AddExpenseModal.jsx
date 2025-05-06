"use client";

import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import { X, Upload } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const AddExpenseModal = ({
  showAddModal,
  setShowAddModal,
  newExpense,
  setNewExpense,
  handleAddExpense,
}) => {
  const { darkMode } = useTheme();
  const { getToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!showAddModal) return null;

  const handleChange = (field) => (e) => {
    setNewExpense({ ...newExpense, [field]: e.target.value });
  };

  // Handle receipt upload and information extraction
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadError("");

    try {
      // Get the authentication token using the AuthContext
      const token = getToken();

      if (!token) {
        setUploadError("You must be logged in to use this feature");
        setIsUploading(false);
        return;
      }

      console.log("Sending receipt to API for processing...");

      const response = await axios.post(
        `${API_BASE_URL}/profile/extract-receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Log the complete response for debugging
      console.log("API Response:", response.data);

      const extractedData = response.data;

      // Auto-fill form fields based on extracted data
      const updatedExpense = { ...newExpense };
      console.log("Before update - Current form state:", newExpense);

      // Fill amount if available (convert to number if needed)
      if (extractedData["Total Amount"]) {
        console.log("Found Total Amount:", extractedData["Total Amount"]);
        // Extract numeric value from the amount string
        const amountStr = extractedData["Total Amount"];
        const amountNum = parseFloat(amountStr.replace(/[^\d.-]/g, ""));

        console.log("Parsed amount:", amountNum);
        if (!isNaN(amountNum)) {
          updatedExpense.amount = amountNum;
          console.log("Updated amount to:", amountNum);
        }
      } else {
        console.log("No Total Amount found in response");
      }

      // Fill description if available
      if (extractedData["Description"]) {
        console.log("Found Description:", extractedData["Description"]);
        updatedExpense.description = extractedData["Description"];
        console.log("Updated description to:", extractedData["Description"]);
      } else {
        console.log("No Description found in response");
      }

      // Match and fill category if available
      if (extractedData["Expense Type"]) {
        const category = extractedData["Expense Type"];
        console.log("Found Expense Type:", category);
        console.log("Available categories:", expenseCategories);

        // Convert both to lowercase for better matching
        const categoryLower = category.toLowerCase().trim();

        // First try exact match
        let matchedCategory = expenseCategories.find(
          (cat) => cat.name.toLowerCase() === categoryLower
        );

        // If no exact match, try partial matches
        if (!matchedCategory) {
          // Try if category contains the expense type
          matchedCategory = expenseCategories.find(
            (cat) =>
              cat.name.toLowerCase().includes(categoryLower) ||
              categoryLower.includes(cat.name.toLowerCase())
          );
        }

        // If still no match, use a mapping for common categories
        if (!matchedCategory) {
          const categoryMap = {
            dining: "Food",
            restaurant: "Food",
            groceries: "Food",
            grocery: "Food",
            supermarket: "Food",
            cafe: "Food",
            transport: "Transportation",
            uber: "Transportation",
            taxi: "Transportation",
            gas: "Transportation",
            fuel: "Transportation",
            utility: "Bills",
            utilities: "Bills",
            electricity: "Bills",
            water: "Bills",
            rent: "Bills",
            phone: "Bills",
            internet: "Bills",
            clothes: "Shopping",
            clothing: "Shopping",
            electronics: "Shopping",
            movie: "Entertainment",
            music: "Entertainment",
            concert: "Entertainment",
            streaming: "Entertainment",
            doctor: "Health",
            medication: "Health",
            pharmacy: "Health",
            dental: "Health",
            tuition: "Education",
            course: "Education",
            book: "Education",
            school: "Education",
          };

          // Check if any keywords in our map appear in the category
          for (const [keyword, mappedCategory] of Object.entries(categoryMap)) {
            if (categoryLower.includes(keyword)) {
              matchedCategory = expenseCategories.find(
                (cat) => cat.name === mappedCategory
              );
              if (matchedCategory) {
                console.log(
                  `Matched via keyword '${keyword}' to category:`,
                  matchedCategory.name
                );
                break;
              }
            }
          }
        }

        if (matchedCategory) {
          updatedExpense.category = matchedCategory.name;
          console.log("Matched to category:", matchedCategory.name);
        } else {
          // Default to "Other" if no match found
          updatedExpense.category = "Other";
          console.log("No category match found, defaulting to 'Other'");
        }
      } else {
        console.log("No Expense Type found in response");
      }

      console.log(
        "After update - Form state will be updated to:",
        updatedExpense
      );

      // Force a re-render by creating a new object reference
      setNewExpense({ ...updatedExpense });

      // Add a success message
      setUploadError("✅ Receipt processed successfully!");
      setTimeout(() => setUploadError(""), 3000);
    } catch (error) {
      console.error("Error extracting receipt information:", error);
      setUploadError("Failed to extract information from receipt");
    } finally {
      setIsUploading(false);
    }
  };

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
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button
            onClick={() => setShowAddModal(false)}
            className={`${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } p-2 rounded-full transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt Upload Button */}
        <div className="pt-6 px-6">
          <div className="w-full">
            <label
              htmlFor="receipt-upload"
              className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer ${
                darkMode
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
              } transition-colors`}
            >
              <div className="flex flex-col items-center justify-center py-2">
                <Upload className="h-6 w-6 mb-2" />
                <p className="text-sm font-medium">
                  {isUploading
                    ? "Processing..."
                    : "Upload Receipt for Auto-Fill"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click to upload an image of your receipt
                </p>
              </div>
              <input
                id="receipt-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleReceiptUpload}
                disabled={isUploading}
              />
            </label>
            {uploadError && (
              <p className="text-red-500 text-xs mt-1">{uploadError}</p>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddExpense();
          }}
          className="p-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category*
              </label>
              <select
                value={newExpense.category}
                onChange={handleChange("category")}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                required
              >
                <option value="">Select category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount*</label>
              <div className="relative">
                <span className="absolute left-3 top-3">$</span>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={handleChange("amount")}
                  placeholder="0.00"
                  className={`w-full pl-8 p-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={newExpense.description}
                onChange={handleChange("description")}
                placeholder="Brief description"
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={newExpense.recurring}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    recurring: e.target.checked,
                  })
                }
                className="h-4 w-4 text-[#065336] focus:ring-[#065336] border-gray-300 rounded"
              />
              <label htmlFor="recurring" className="ml-2 block text-sm">
                Recurring Expense
              </label>
            </div>

            {newExpense.recurring && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Recurring Period
                </label>
                <select
                  value={newExpense.recurrence_duration}
                  onChange={handleChange("recurrence_duration")}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:ring-2 focus:ring-[#065336] focus:border-[#065336] transition-colors`}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
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
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
