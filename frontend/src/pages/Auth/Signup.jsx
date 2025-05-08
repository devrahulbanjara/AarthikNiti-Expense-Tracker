import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [otp, setOtp] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const currencies = [
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "INR", name: "Indian Rupee (₹)" },
    { code: "NPR", name: "Nepali Rupee (₨)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" },
    { code: "CNY", name: "Chinese Yuan (¥)" },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || !validatePassword(password)) {
      setError("Password does not meet the requirements");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsSigningUp(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/signup`,
        {
          full_name: name,
          email: email,
          password: password,
          currency_preference: currency,
        },
        { withCredentials: true }
      );

      if (response.data) {
        toast.success(
          "OTP sent to your email. Please verify to complete signup."
        );
        setStep(2);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.detail === "Email already registered"
      ) {
        setError("Email already exists. Please login instead.");
      } else {
        setError(
          error.response?.data?.detail || "Signup failed. Please try again."
        );
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    setIsSigningUp(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/complete-signup`,
        {
          email: email,
          otp: otp,
          full_name: name,
          password: password,
          currency_preference: currency,
        },
        { withCredentials: true }
      );

      if (response.data) {
        toast.success("Signup successful! Please login to continue.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(
        error.response?.data?.detail ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Back Button */}
      <button
        onClick={handleBackToLanding}
        className="absolute top-4 left-4 z-50 flex items-center p-2 text-white bg-[#065336]/80 hover:bg-[#065336] rounded-full transition-all duration-300"
        aria-label="Back to Landing Page"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-48 md:h-screen relative bg-[#065336] transition-all duration-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 transform transition-transform duration-500 hover:scale-105">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">
              AarthikNiti
            </h1>
            <p className="text-lg md:text-xl animate-fade-in-delay">
              Your Personal Finance Manager
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16 transition-all duration-500">
        <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl mb-2 font-semibold text-gray-800 animate-fade-in">
            {step === 1 ? "Create an account" : "Verify your email"}
          </h2>
          <p className="mb-6 text-gray-600 text-sm md:text-base animate-fade-in-delay">
            {step === 1
              ? "Enter your details to get started"
              : "Enter the OTP sent to your email"}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none pr-10"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#0a6e47] transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <div className="flex items-center">
                    {passwordRequirements.length ? (
                      <Check className="w-4 h-4 text-[#0a6e47] mr-1" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center">
                    {passwordRequirements.uppercase ? (
                      <Check className="w-4 h-4 text-[#0a6e47] mr-1" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span>One uppercase letter</span>
                  </div>
                  <div className="flex items-center">
                    {passwordRequirements.number ? (
                      <Check className="w-4 h-4 text-[#0a6e47] mr-1" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span>One number</span>
                  </div>
                  <div className="flex items-center">
                    {passwordRequirements.special ? (
                      <Check className="w-4 h-4 text-[#0a6e47] mr-1" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span>One special character</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none pr-10"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#0a6e47] transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 text-[#0a6e47] border-gray-300 rounded focus:ring-[#0a6e47] transition-colors duration-200"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-[#0a6e47] hover:text-[#054328] transition-colors duration-200"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSigningUp}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 transform ${
                  isSigningUp
                    ? "bg-[#0a6e47]/70 cursor-not-allowed"
                    : "bg-[#0a6e47] hover:bg-[#054328] hover:scale-[1.02]"
                }`}
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Signup"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0a6e47] focus:ring-2 focus:ring-[#0a6e47]/20 outline-none"
                  required
                />
                <p className="text-sm text-gray-500">
                  An OTP has been sent to your email {email}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 rounded-lg text-gray-800 font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className={`flex-1 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                    isSigningUp
                      ? "bg-[#0a6e47]/70 cursor-not-allowed"
                      : "bg-[#0a6e47] hover:bg-[#054328]"
                  }`}
                >
                  {isSigningUp ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Complete Signup"
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0a6e47] hover:text-[#054328] font-medium transition-colors duration-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
