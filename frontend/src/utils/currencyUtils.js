import axios from "axios";

// API configuration
const API_URL = "https://api.exchangeratesapi.io/v1/latest";
const API_KEY = "1f705e818a0beba2979f1ad053f82328";

// Default rates to use as fallback (relative to USD as base)
const defaultRates = {
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

// Local storage keys
const RATES_STORAGE_KEY = "aarthik_exchange_rates";
const RATES_TIMESTAMP_KEY = "aarthik_exchange_rates_timestamp";
const RATES_ERROR_KEY = "aarthik_exchange_rates_error";
const RATES_RETRY_KEY = "aarthik_exchange_rates_retry_after";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds (increased from 1 hour)

/**
 * Fetches the latest exchange rates from the API
 * @param {boolean} forceRefresh - Force refresh even if cache is valid
 * @param {string} baseCurrency - Base currency for rates (default: USD)
 * @returns {Promise<Object>} - Object with exchange rates
 */
export const fetchExchangeRates = async (
  forceRefresh = false,
  baseCurrency = "USD"
) => {
  try {
    // Check if we're in a rate-limited state
    const retryAfter = localStorage.getItem(RATES_RETRY_KEY);
    if (retryAfter && !forceRefresh) {
      const retryTime = parseInt(retryAfter);
      if (Date.now() < retryTime) {
        console.log("Rate limited, using cached rates");
        const remainingTime = Math.ceil((retryTime - Date.now()) / 60000);
        saveApiError(`Rate limited. Try again in ${remainingTime} minutes.`);
        return getLocalRates() || defaultRates;
      }
    }

    // Check if we have cached rates that are still valid
    const cachedRates = getLocalRates();
    if (cachedRates && !isCacheExpired() && !forceRefresh) {
      console.log("Using cached exchange rates");
      return cachedRates;
    }

    // Fetch new rates
    console.log("Fetching fresh exchange rates");
    const response = await axios.get(`${API_URL}?access_key=${API_KEY}`);

    // Clear any previous errors and rate limits
    localStorage.removeItem(RATES_ERROR_KEY);
    localStorage.removeItem(RATES_RETRY_KEY);

    if (response.data && response.data.success === true) {
      const rates = response.data.rates;

      // Validate that we have all our currencies
      const requiredCurrencies = Object.keys(defaultRates);
      const missingCurrencies = requiredCurrencies.filter(
        (curr) => !rates[curr]
      );

      if (missingCurrencies.length > 0) {
        // Log missing currencies but still save what we got
        console.warn(
          `Missing exchange rates for: ${missingCurrencies.join(", ")}`
        );

        // Add missing currencies using default rates, relatively adjusted to the rates we did get
        const usdRate = rates.USD || 1;
        missingCurrencies.forEach((currency) => {
          rates[currency] = defaultRates[currency] * usdRate;
        });
      }

      // Store rates in local storage
      saveLocalRates(rates);

      // Convert rates if baseCurrency is not USD (since the API might only support EUR as base with free plan)
      if (baseCurrency !== "USD" && rates[baseCurrency]) {
        return convertToNewBase(rates, baseCurrency);
      }

      return rates;
    } else {
      // Store the error message for UI display
      if (response.data && response.data.error) {
        const errorMsg =
          response.data.error.type ||
          response.data.error.info ||
          "Unknown API error";
        saveApiError(errorMsg);
        console.error("API Error:", errorMsg);
      }

      return getLocalRates() || defaultRates;
    }
  } catch (error) {
    // Handle rate limiting (429) errors specially
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded");

      // Set a retry after period (1 hour by default or use the header if available)
      let retryAfterMs = 60 * 60 * 1000; // Default: 1 hour

      // Check if the server provided a Retry-After header
      const retryAfterHeader = error.response.headers["retry-after"];
      if (retryAfterHeader) {
        // If the header is a timestamp, use it directly
        if (isNaN(retryAfterHeader)) {
          const retryDate = new Date(retryAfterHeader);
          retryAfterMs = retryDate.getTime() - Date.now();
        } else {
          // If the header is seconds, convert to milliseconds
          retryAfterMs = parseInt(retryAfterHeader) * 1000;
        }
      }

      // Set the retry timestamp
      const retryTime = Date.now() + retryAfterMs;
      localStorage.setItem(RATES_RETRY_KEY, retryTime.toString());

      // Save readable error
      const minutes = Math.ceil(retryAfterMs / 60000);
      saveApiError(`Rate limit exceeded. Try again in ${minutes} minutes.`);
    } else {
      // Handle other network or API errors
      const errorMsg =
        error.message || "Network error while fetching exchange rates";
      saveApiError(errorMsg);
      console.error("Failed to fetch exchange rates:", error);
    }

    // Return cached rates or defaults if API call fails
    return getLocalRates() || defaultRates;
  }
};

/**
 * Saves API error message to local storage
 * @param {string} errorMsg - Error message from API
 */
const saveApiError = (errorMsg) => {
  localStorage.setItem(RATES_ERROR_KEY, errorMsg);
};

/**
 * Gets last API error from local storage
 * @returns {string|null} - Error message or null
 */
export const getLastApiError = () => {
  return localStorage.getItem(RATES_ERROR_KEY);
};

/**
 * Converts rates from USD base to a new base currency
 * @param {Object} rates - Rates with USD base
 * @param {string} newBase - New base currency
 * @returns {Object} - Rates with new base
 */
const convertToNewBase = (rates, newBase) => {
  const newBaseRate = rates[newBase];

  if (!newBaseRate) {
    console.error(`Cannot convert to ${newBase} base, rate not available`);
    return rates;
  }

  const newRates = {};
  Object.entries(rates).forEach(([currency, rate]) => {
    newRates[currency] = rate / newBaseRate;
  });

  return newRates;
};

/**
 * Saves rates to local storage with timestamp
 * @param {Object} rates - Exchange rates object
 */
const saveLocalRates = (rates) => {
  localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
  localStorage.setItem(RATES_TIMESTAMP_KEY, Date.now().toString());
};

/**
 * Gets rates from local storage
 * @returns {Object|null} - Stored rates or null if not found
 */
const getLocalRates = () => {
  const ratesStr = localStorage.getItem(RATES_STORAGE_KEY);
  if (!ratesStr) return null;

  try {
    return JSON.parse(ratesStr);
  } catch (e) {
    console.error("Failed to parse cached rates", e);
    return null;
  }
};

/**
 * Checks if cached rates are expired
 * @returns {boolean} - True if cache is expired
 */
const isCacheExpired = () => {
  const timestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
  if (!timestamp) return true;

  const expiryTime = parseInt(timestamp) + CACHE_DURATION;
  return Date.now() > expiryTime;
};

/**
 * Gets the timestamp of when rates were last updated
 * @returns {Date|null} - Date object or null if no timestamp
 */
export const getLastUpdatedTime = () => {
  const timestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
  return timestamp ? new Date(parseInt(timestamp)) : null;
};

/**
 * Checks if the currency service is rate limited
 * @returns {boolean} - True if rate limited
 */
export const isRateLimited = () => {
  const retryAfter = localStorage.getItem(RATES_RETRY_KEY);
  if (!retryAfter) return false;

  const retryTime = parseInt(retryAfter);
  return Date.now() < retryTime;
};

/**
 * Converts amount from one currency to another using the provided rates
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} rates - Exchange rates object (with USD as base)
 * @returns {number} - Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates || !amount) return amount;

  // If same currency, no conversion needed
  if (fromCurrency === toCurrency) return amount;

  try {
    // If either currency is missing from rates, return original amount
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      console.error(`Missing rate for ${fromCurrency} or ${toCurrency}`);
      return amount;
    }

    // Convert amount to USD first (as base), then to target currency
    const amountInUSD =
      fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
    const convertedAmount =
      toCurrency === "USD" ? amountInUSD : amountInUSD * rates[toCurrency];

    return convertedAmount;
  } catch (error) {
    console.error("Conversion error:", error);
    return amount;
  }
};
