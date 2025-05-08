import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchExchangeRates,
  convertCurrency,
  getLastApiError,
  isRateLimited,
} from "../utils/currencyUtils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define currencies with full information
const SUPPORTED_CURRENCIES = [
  {
    code: "NPR",
    name: "Nepali Rupee",
    symbol: "NRs",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    position: "before",
    separator: ",",
    precision: 0,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    position: "before",
    separator: ",",
    precision: 2,
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    position: "before",
    separator: ",",
    precision: 2,
  },
];

// Currency symbols and formatting preferences
const currencyConfig = {};
SUPPORTED_CURRENCIES.forEach((currency) => {
  currencyConfig[currency.code] = {
    symbol: currency.symbol,
    position: currency.position,
    separator: currency.separator,
    precision: currency.precision,
  };
});

// Define fallback exchange rates (relative to USD as base)
const fallbackRates = {
  NPR: 133.2,
  INR: 83.25,
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.23,
  CAD: 1.37,
  AUD: 1.53,
  CNY: 7.21,
};

// Map currency info for easy access
const currencyInfo = {};
SUPPORTED_CURRENCIES.forEach((currency) => {
  currencyInfo[currency.code] = {
    code: currency.code,
    name: currency.name,
  };
});

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const { getToken } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [isUpdating, setIsUpdating] = useState(false);
  const [rates, setRates] = useState(fallbackRates);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [rateLimited, setRateLimited] = useState(false);

  // Load exchange rates on initial load and periodically refresh
  useEffect(() => {
    const loadExchangeRates = async () => {
      // Don't try to load rates if we're rate limited
      if (isRateLimited() && !isLoadingRates) {
        setRateLimited(true);
        setApiError(getLastApiError());
        return;
      }

      setIsLoadingRates(true);
      try {
        const fetchedRates = await fetchExchangeRates();
        setRates(fetchedRates);
        setLastUpdated(new Date());

        // Check for API errors even if we got rates (might be from cache)
        const error = getLastApiError();
        setApiError(error);

        // Check if we're rate limited after the request
        setRateLimited(isRateLimited());

        console.log("Exchange rates updated:", fetchedRates);
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
        setApiError("Failed to load exchange rates");
        // Keep using fallback rates if API fails
      } finally {
        setIsLoadingRates(false);
      }
    };

    // Load rates immediately
    loadExchangeRates();

    // Setup periodic refresh (every hour instead of 30 minutes)
    // Only refresh if we're not rate limited
    const refreshInterval = setInterval(() => {
      if (!isRateLimited()) {
        loadExchangeRates();
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Load user's preferred currency on initial load
  useEffect(() => {
    const loadUserCurrency = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        if (userData.currency_preference) {
          setCurrency(userData.currency_preference);
        }
      } catch (error) {
        console.error("Error loading user currency:", error);
      }
    };

    loadUserCurrency();
  }, [getToken]);

  // Function to update user's currency preference in the backend
  const updateUserCurrency = async (newCurrency) => {
    if (!getToken()) {
      setCurrency(newCurrency); // Still update state even without token
      return;
    }

    setIsUpdating(true);
    // Update state immediately for better UX
    setCurrency(newCurrency);

    try {
      const token = getToken();
      const response = await fetch(`${BACKEND_URL}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currency_preference: newCurrency }),
      });

      if (!response.ok) {
        console.error(
          `Failed to update currency preference: ${response.status}`
        );
        // We don't revert the currency state since this would be confusing to users
      } else {
        console.log("Currency preference updated successfully");
      }
    } catch (error) {
      console.error("Error updating currency preference:", error);
      // We keep the currency change in the UI even if the backend update fails
    } finally {
      setIsUpdating(false);
    }
  };

  // Currency conversion functions using live rates
  const convertAmount = (
    amount,
    fromCurrency = "USD",
    toCurrency = currency
  ) => {
    if (amount === null || amount === undefined) return 0;

    try {
      // Log conversion details for debugging
      console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);

      // Make sure we have valid currencies
      if (!rates[fromCurrency]) {
        console.error(`Missing exchange rate for ${fromCurrency}`);
        return amount; // Return original if we can't convert
      }

      if (!rates[toCurrency]) {
        console.error(`Missing exchange rate for ${toCurrency}`);
        return amount; // Return original if we can't convert
      }

      // Use the utility function to convert with current rates
      const convertedAmount = convertCurrency(
        amount,
        fromCurrency,
        toCurrency,
        rates
      );

      console.log(`Converted result: ${convertedAmount}`);
      return convertedAmount;
    } catch (error) {
      console.error("Error in currency conversion:", error);
      return amount; // Return original if conversion fails
    }
  };

  // Format amount with currency symbol and appropriate formatting
  const formatCurrency = (amount, currencyCode = currency) => {
    if (amount === null || amount === undefined) return "";

    const config = currencyConfig[currencyCode];
    if (!config) return `${amount}`;

    // Format the number according to locale and precision
    const formattedNumber = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: config.precision,
      maximumFractionDigits: config.precision,
    });

    // Apply the currency symbol in the correct position
    return config.position === "before"
      ? `${config.symbol}${formattedNumber}`
      : `${formattedNumber}${config.symbol}`;
  };

  // Get current exchange rate between two currencies
  const getExchangeRate = (fromCurrency, toCurrency = currency) => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return 1;

    // Convert via USD (base currency for API)
    if (fromCurrency === "USD") return rates[toCurrency];
    if (toCurrency === "USD") return 1 / rates[fromCurrency];

    return rates[toCurrency] / rates[fromCurrency];
  };

  // Get all supported currencies
  const getSupportedCurrencies = () => {
    return SUPPORTED_CURRENCIES.map((currency) => ({
      code: currency.code,
      name: currency.name,
    }));
  };

  // Force refresh of exchange rates
  const refreshRates = async () => {
    // Don't try to refresh if we're rate limited
    if (isRateLimited() && !isLoadingRates) {
      setRateLimited(true);
      setApiError(getLastApiError());
      return false;
    }

    setIsLoadingRates(true);
    setApiError(null);
    try {
      const freshRates = await fetchExchangeRates(true); // Force refresh
      setRates(freshRates);
      setLastUpdated(new Date());

      // Check for API errors
      const error = getLastApiError();
      setApiError(error);

      // Check if we're rate limited after the request
      setRateLimited(isRateLimited());

      return true;
    } catch (error) {
      console.error("Failed to refresh rates:", error);
      setApiError("Failed to refresh rates: " + error.message);
      return false;
    } finally {
      setIsLoadingRates(false);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: updateUserCurrency,
        isUpdating,
        convertAmount,
        formatCurrency,
        getExchangeRate,
        getSupportedCurrencies,
        rates,
        isLoadingRates,
        lastUpdated,
        refreshRates,
        apiError,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
