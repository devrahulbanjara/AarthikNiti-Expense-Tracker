"use client";

import { expenseCategories } from "../../pages/Dashboard/expenseCategories";
import {
  X,
  Upload,
  Camera,
  Paperclip,
  Receipt,
  Check,
  FileType,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  if (!showAddModal) return null;

  const handleChange = (field) => (e) => {
    setNewExpense({ ...newExpense, [field]: e.target.value });
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Simulate receipt processing progress
  const simulateProgress = () => {
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Reset states
    setUploadSuccess(false);
    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    // Start progress simulation
    const stopProgressSimulation = simulateProgress();

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
        `${BACKEND_URL}/profile/extract-receipt`,
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

      // Set success state
      setUploadSuccess(true);
      setProcessingProgress(100);

      // Clear success message after a few seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error extracting receipt information:", error);
      setUploadError("Failed to extract information from receipt");
      setProcessingProgress(0);
    } finally {
      setIsUploading(false);
      // Clear progress simulation if it's still running
      if (stopProgressSimulation) stopProgressSimulation();
    }
  };

  // Handle receipt upload and information extraction
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Render the upload area
  const renderUploadArea = () => {
    return (
      <div className="pt-6 px-6">
        <div
          className={`w-full relative overflow-hidden transition-all duration-300 ease-in-out ${
            dragActive ? "scale-[1.02]" : ""
          }`}
          onDragEnter={handleDrag}
        >
          <div
            className={`
              flex flex-col items-center justify-center w-full py-6 px-4 
              border-2 ${
                dragActive
                  ? "border-[#065336]"
                  : darkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              } 
              ${
                dragActive
                  ? "bg-[#06533610]"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }
              border-dashed rounded-lg cursor-pointer transition-all duration-300
              ${isUploading ? "opacity-75" : "opacity-100"}
              hover:shadow-md hover:scale-[1.01] hover:border-[#065336]
              group
            `}
            onClick={handleButtonClick}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
              // Loading state
              <div className="flex flex-col items-center py-2 space-y-3">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <Receipt className="h-12 w-12 text-gray-400 animate-pulse" />
                  <div className="absolute inset-0 rounded-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-300 stroke-current"
                        strokeWidth="6"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-[#065336] progress-ring stroke-current"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 45}`,
                          strokeDashoffset: `${
                            2 * Math.PI * 45 * (1 - processingProgress / 100)
                          }`,
                          transformOrigin: "50% 50%",
                          transform: "rotate(-90deg)",
                        }}
                      />
                    </svg>
                  </div>
                  <div className="absolute text-sm font-semibold">
                    {Math.round(processingProgress)}%
                  </div>
                </div>
                <p className="text-md font-medium">Processing Receipt...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[240px]">
                  Reading data and extracting expense details
                </p>
              </div>
            ) : uploadSuccess ? (
              // Success state
              <div className="flex flex-col items-center py-2 space-y-2">
                <div className="h-14 w-14 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-1 shadow-inner">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-md font-medium text-green-600 dark:text-green-300">
                  Receipt Scanned Successfully!
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {newExpense.amount ? (
                    <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-200 shadow-sm">
                      <span className="text-blue-500 dark:text-blue-300 mr-1">
                        Amount:
                      </span>
                      ${newExpense.amount.toFixed(2)}
                    </div>
                  ) : null}
                  {newExpense.category ? (
                    <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-200 shadow-sm">
                      <span className="text-emerald-500 dark:text-emerald-300 mr-1">
                        Category:
                      </span>
                      {newExpense.category}
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-[280px] text-center">
                  Form fields have been pre-filled with the extracted
                  information
                </p>
              </div>
            ) : (
              // Default upload state
              <div className="flex flex-col items-center py-4">
                <div className="flex gap-3 mb-3">
                  <Receipt className="h-8 w-8 text-[#065336] group-hover:scale-110 transition-transform group-hover:text-[#074328]" />
                  <Camera className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  <Paperclip className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
                <p className="text-md font-medium mb-1 group-hover:text-[#065336] transition-colors">
                  Upload Receipt for Auto-Fill
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[240px]">
                  Drag and drop an image here or click to browse
                </p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <FileType className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accepts JPG, PNG images
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              id="receipt-upload"
              type="file"
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={handleReceiptUpload}
              disabled={isUploading}
            />
          </div>
          {uploadError && (
            <div className="mt-2 px-4 py-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-800 rounded-md shadow-sm">
              <p className="text-red-800 dark:text-red-200 text-sm flex items-center font-medium">
                <X className="h-4 w-4 mr-2 flex-shrink-0 text-red-600 dark:text-red-300" />
                {uploadError}
              </p>
              <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                Please try again with a clearer image or enter details manually.
              </p>
            </div>
          )}
        </div>
      </div>
    );
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

        {/* Enhanced Receipt Upload Area */}
        {renderUploadArea()}

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
