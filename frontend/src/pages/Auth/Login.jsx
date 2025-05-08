import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  LockKeyhole,
  Mail,
  AlertCircle,
  Shield,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import googleLogoImg from "../../assets/ExtraImg/google.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Two-factor authentication state
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenFromURL = urlParams.get("access_token");

    if (accessTokenFromURL) {
      login(accessTokenFromURL, rememberMe);
      toast.success("Login successful!");
      navigate("/dashboard");
    }
  }, [navigate, login, rememberMe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoggingIn(true);
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Check if two-factor authentication is required
      if (response.data && response.data.requires_two_factor) {
        setRequiresTwoFactor(true);
        toast.success("Verification code sent to your email");
      }
      // Check for token (backend may return either 'token' or 'access_token')
      else if (
        response.data &&
        (response.data.token || response.data.access_token)
      ) {
        // Use whichever token is available
        const authToken = response.data.token || response.data.access_token;
        login(authToken, rememberMe);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Invalid response from server.");
        console.log("Server response:", response.data); // Debug log
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerificationError("");

    if (!verificationCode) {
      setVerificationError("Please enter the verification code");
      return;
    }

    try {
      setVerificationLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/auth/verify-two-factor`,
        { email, password, code: verificationCode },
        { withCredentials: true }
      );

      // Check for token (backend may return either 'token' or 'access_token')
      if (
        response.data &&
        (response.data.token || response.data.access_token)
      ) {
        // Use whichever token is available
        const authToken = response.data.token || response.data.access_token;
        login(authToken, rememberMe);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        setVerificationError("Invalid response from server.");
        console.log("Verification response:", response.data); // Debug log
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationError(
        error.response?.data?.detail || "Verification failed"
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  // Back to login form
  const handleBackToLogin = () => {
    setRequiresTwoFactor(false);
    setVerificationCode("");
    setVerificationError("");
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google/login`;
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } relative`}
    >
      {/* Back Button */}
      <button
        onClick={handleBackToLanding}
        className="absolute top-4 left-4 z-10 flex items-center p-2 text-white bg-[#065336]/80 hover:bg-[#065336] rounded-full transition-all duration-300"
        aria-label="Back to Landing Page"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Left side - Image */}
      <div
        className={`w-full md:w-1/2 h-48 md:h-screen relative bg-[#065336] transition-all duration-500 ${
          requiresTwoFactor ? "blur-[3px]" : ""
        }`}
      >
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

      {/* Right side - Login Form with Two-Factor Authentication Overlay */}
      <div
        className={`w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16 transition-all duration-500 relative ${
          requiresTwoFactor ? "blur-[3px]" : ""
        }`}
      >
        {/* Login Form */}
        <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl mb-2 font-semibold text-gray-800 animate-fade-in">
            Welcome back
          </h2>
          <p className="mb-6 text-gray-600 text-sm md:text-base animate-fade-in-delay">
            Enter your credentials to sign in to your account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#0a6e47] border-gray-300 rounded focus:ring-[#0a6e47] transition-colors duration-200"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgotpw"
                className="text-sm text-[#0a6e47] hover:text-[#054328] transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm animate-fade-in">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoggingIn}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 transform ${
                isLoggingIn
                  ? "bg-[#0a6e47]/70 cursor-not-allowed"
                  : "bg-[#0a6e47] hover:bg-[#054328] hover:scale-[1.02]"
              }`}
            >
              {isLoggingIn ? (
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#0a6e47] hover:text-[#054328] font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Two-factor Authentication Modal Overlay - Positioned Fixed over everything */}
      {requiresTwoFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } transform transition-all animate-fade-in`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield
                  className={`mr-3 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                  size={22}
                />
                <h2 className="text-xl font-semibold">Two-Step Verification</h2>
              </div>
              <button
                onClick={handleBackToLogin}
                className={`p-1 rounded-full hover:bg-opacity-10 ${
                  darkMode ? "hover:bg-gray-300" : "hover:bg-gray-700"
                }`}
              >
                <XCircle
                  size={20}
                  className={darkMode ? "text-gray-300" : "text-gray-500"}
                />
              </button>
            </div>

            <p
              className={`mb-5 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              We've sent a verification code to your email{" "}
              <span className="font-medium">{email}</span>. Please enter the
              code below to complete your login.
            </p>

            {verificationError && (
              <div
                className={`flex items-center mb-4 p-3 rounded-md ${
                  darkMode
                    ? "bg-red-900/30 text-red-200"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                <span className="text-sm">{verificationError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCode}>
              <div className="mb-5">
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`text-center text-lg tracking-widest w-48 py-3 font-medium rounded border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    placeholder="••••••"
                    autoFocus
                  />
                </div>
                <p
                  className={`text-center mt-2 text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Enter 6-digit verification code
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className={`px-4 py-2 rounded text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verificationLoading}
                  className={`px-6 py-2 rounded-md ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white transition-all duration-200 ${
                    verificationLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {verificationLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    </div>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
