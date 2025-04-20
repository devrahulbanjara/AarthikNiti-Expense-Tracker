import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import googleLogoImg from "../../assets/ExtraImg/google.png";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

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
      setError("Email and Password are required");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.access_token) {
        login(response.data.access_token, rememberMe);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google/login`;
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-all duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-48 md:h-screen relative bg-[#065336] transition-all duration-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4 transform transition-transform duration-500 hover:scale-105">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">AarthikNiti</h1>
            <p className="text-lg md:text-xl animate-fade-in-delay">Your Personal Finance Manager</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16 transition-all duration-500">
        <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl mb-2 font-semibold text-gray-800 animate-fade-in">Welcome back</h2>
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
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
    </div>
  );
}

export default Login;
