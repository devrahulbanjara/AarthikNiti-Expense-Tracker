import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  RefreshCw,
  AlertCircle,
  Clock,
  DollarSign,
  ChevronDown,
} from "lucide-react";

// Define allowed currencies with full names
const ALLOWED_CURRENCIES = [
  { code: "NPR", name: "Nepali Rupee", symbol: "NRs" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
];

const CompactCurrencyDropdown = () => {
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

  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-black";
  const mutedTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const errorColor = "text-red-500";
  const warningColor = "text-amber-500";

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const handleCurrencyChange = (code) => {
    setCurrency(code);
    setShowTooltip(false);
  };

  const handleRefreshRates = async (e) => {
    e.stopPropagation();
    await refreshRates();
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never updated";

    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hrs ago`;

    return lastUpdated.toLocaleString().split(",")[0];
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

  // Get currency name with symbol
  const getCurrencyNameWithSymbol = (code) => {
    const currencyInfo = ALLOWED_CURRENCIES.find((c) => c.code === code);
    if (!currencyInfo) return code;
    return `${currencyInfo.name} (${currencyInfo.symbol})`;
  };

  // Find full currency info by code
  const getCurrentCurrencyInfo = () => {
    return (
      ALLOWED_CURRENCIES.find((c) => c.code === currency) ||
      ALLOWED_CURRENCIES[0]
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <div
          className="flex items-center space-x-1 cursor-pointer px-2 py-1 rounded-md group"
          onClick={toggleTooltip}
        >
          <DollarSign
            className={`h-4 w-4 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } transition-colors ${
              showTooltip ? "text-green-500" : ""
            } group-hover:text-green-500`}
          />
          <div className="flex items-center">
            <span className={`text-xs ${textColor}`}>{currency}</span>
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${
                showTooltip ? "rotate-180" : "rotate-0"
              } ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            />
          </div>
          <button
            onClick={handleRefreshRates}
            disabled={isLoadingRates || rateLimited}
            className={`p-1 rounded-md ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 ${
              rateLimited ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={rateLimited ? "Rate limited, try later" : "Refresh rates"}
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoadingRates ? "animate-spin" : ""} ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } hover:text-green-500 transition-colors`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown on click only */}
      {showTooltip && (
        <div
          className={`absolute right-0 top-full mt-1 z-50 p-3 rounded-md shadow-lg w-64
            ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            } animate-fadeIn
          `}
        >
          <div className="text-xs space-y-2">
            {/* Current currency detail */}
            <div>
              <div className={`font-bold text-sm ${textColor} mb-1`}>
                {getCurrentCurrencyInfo().name}
              </div>
              <div className={`flex items-center ${mutedTextColor}`}>
                <span>Symbol: {getCurrentCurrencyInfo().symbol}</span>
                <span className="mx-2">•</span>
                <span>Code: {getCurrentCurrencyInfo().code}</span>
              </div>
            </div>

            {/* Available currencies */}
            <div className="pt-2 border-t border-gray-600">
              <div className="font-medium mb-1">Available Currencies</div>
              <div className="max-h-36 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 gap-1">
                  {ALLOWED_CURRENCIES.map(({ code, name, symbol }) => (
                    <div
                      key={code}
                      className={`flex justify-between items-center p-1 rounded ${
                        code === currency
                          ? darkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                          : ""
                      } cursor-pointer ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleCurrencyChange(code)}
                    >
                      <span className="font-medium">{code}</span>
                      <span className={mutedTextColor}>
                        {name} ({symbol})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exchange rates status */}
            <div className="pt-2 border-t border-gray-600">
              <div
                className={`flex items-center ${
                  apiError
                    ? rateLimited
                      ? warningColor
                      : errorColor
                    : mutedTextColor
                }`}
              >
                <span className="text-xs">
                  Exchange rates: {formatLastUpdated()}
                </span>
                {isLoadingRates && (
                  <span className="ml-1 inline-flex items-center">
                    <div className="animate-spin h-2 w-2 ml-1 border border-current rounded-full border-t-transparent"></div>
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
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                  )}
                  <span className="break-words">{formatErrorMessage()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactCurrencyDropdown;
