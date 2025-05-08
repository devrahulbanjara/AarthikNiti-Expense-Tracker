"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const currencyRates = [
  { code: "NPR", name: "Nepalese Rupee", rateToNPR: 1.0 },
  { code: "INR", name: "Indian Rupee", rateToNPR: 1.6 },
  { code: "USD", name: "US Dollar", rateToNPR: 133.2 },
  { code: "EUR", name: "Euro", rateToNPR: 145.1 },
  { code: "GBP", name: "British Pound", rateToNPR: 167.22 },
  { code: "JPY", name: "Japanese Yen", rateToNPR: 0.87 },
  { code: "CAD", name: "Canadian Dollar", rateToNPR: 97.02 },
  { code: "AUD", name: "Australian Dollar", rateToNPR: 87.31 },
  { code: "CNY", name: "Chinese Yuan", rateToNPR: 18.48 },
];

const CurrencyDropdown = ({ selectedCurrency, onCurrencyChange }) => {
  const { darkMode } = useTheme();

  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div className="inline-flex items-center space-x-2 mb-4">
      <label htmlFor="currency-select" className={`font-semibold ${textColor}`}>
        Select Currency:
      </label>
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className={`${borderColor} rounded-md p-2 min-w-[150px] ${bgColor} ${textColor} border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
        style={{ borderWidth: "1px" }}
      >
        {currencyRates.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyDropdown;
