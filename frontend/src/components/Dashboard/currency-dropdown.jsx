"use client";

import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";
import { RefreshCw, AlertCircle, Clock } from "lucide-react"; // Added Clock icon

const CurrencyDropdown = () => {
  const { darkMode } = useTheme();
  const {
    currency,
    setCurrency,
    isUpdating,
    getSupportedCurrencies,
    rates,
    lastUpdated,
    isLoadingRates,
    refreshRates,
    apiError,
    rateLimited,
  } = useCurrency();

  // Log currency changes
  useEffect(() => {
    console.log("Current currency in dropdown:", currency);
  }, [currency]);

  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-black";
  const mutedTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const errorColor = "text-red-500";
  const warningColor = "text-amber-500";

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    console.log(`Changing currency from ${currency} to ${newCurrency}`);
    setCurrency(newCurrency);
  };

  const handleRefreshRates = async () => {
    console.log("Refreshing exchange rates...");
    await refreshRates();
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never updated";

    // Calculate time difference
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    return lastUpdated.toLocaleString();
  };

  // Format the error message
  const formatErrorMessage = () => {
    if (!apiError) return null;

    // Handle rate limit error specially
    if (apiError.includes("Rate limit") || apiError.includes("rate limited")) {
      return apiError;
    }

    // Handle other common API errors
    if (apiError.includes("base_currency_access_restricted")) {
      return "Free API plan only supports EUR as base currency";
    }

    // Return original error for other cases
    return apiError;
  };

  return (
    <div className="space-y-2">
      <div className="inline-flex items-center space-x-2">
        <label
          htmlFor="currency-select"
          className={`font-semibold ${textColor}`}
        >
          Select Currency:
        </label>
        <div className="relative">
          <select
            id="currency-select"
            value={currency}
            onChange={handleCurrencyChange}
            disabled={isUpdating}
            className={`${borderColor} rounded-md p-2 min-w-[150px] ${bgColor} ${textColor} border focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
            style={{ borderWidth: "1px" }}
          >
            {Object.entries(rates).map(([code]) => {
              const currencyOption = getSupportedCurrencies().find(
                (c) => c.code === code
              );
              if (!currencyOption) return null;
              return (
                <option key={code} value={code}>
                  {currencyOption.name} ({code})
                </option>
              );
            })}
          </select>
          {isUpdating && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-green-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
        <button
          onClick={handleRefreshRates}
          disabled={isLoadingRates || rateLimited}
          className={`p-2 rounded-md ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
            rateLimited ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={
            rateLimited ? "Rate limited, try later" : "Refresh exchange rates"
          }
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoadingRates ? "animate-spin" : ""} ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <div
        className={`text-xs flex items-center ${
          apiError ? "flex-col items-start gap-1" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            apiError
              ? rateLimited
                ? warningColor
                : errorColor
              : mutedTextColor
          }`}
        >
          <span>Exchange rates: {formatLastUpdated()}</span>
          {isLoadingRates && (
            <span className="ml-2 inline-flex items-center">
              <div className="animate-spin h-3 w-3 mr-1 border border-current rounded-full border-t-transparent"></div>
              Updating...
            </span>
          )}
        </div>

        {apiError && (
          <div
            className={`flex items-center ${
              rateLimited ? warningColor : errorColor
            } text-xs mt-1`}
          >
            {rateLimited ? (
              <Clock className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            <span>{formatErrorMessage()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyDropdown;
