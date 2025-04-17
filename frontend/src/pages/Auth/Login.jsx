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

    if (!email || !password) {
      toast.error("Email and Password are required");
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
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google/login`;
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-48 md:h-screen relative bg-[#065336]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">AarthikNiti</h1>
            <p className="text-lg md:text-xl">Your Personal Finance Manager</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16">
        <h2 className="text-2xl md:text-3xl mb-2">Welcome back</h2>
        <p className="mb-4 text-gray-700 text-sm md:text-base">
          Enter your credentials to sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm md:text-md mt-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 md:p-3 mt-1 border border-gray-500 rounded text-black"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm md:text-md mt-2 font-medium text-gray-700"
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
                className="w-full p-2 md:p-3 mt-1 border border-gray-500 rounded pr-10 text-black"
                required
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgotpw"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0a6e47] text-white py-2 md:py-3 rounded hover:bg-[#054328] transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
