import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password || !validatePassword(password)) {
      toast.error("Password does not meet the requirements");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      toast.error("You must agree to the terms and conditions");
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
        toast.success("Signup successful! Please login to continue.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.detail === "Email already registered"
      ) {
        toast.error("Email already exists. Please login instead.");
      } else {
        toast.error(
          error.response?.data?.detail || "Signup failed. Please try again."
        );
      }
    } finally {
      setIsSigningUp(false);
    }
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

      {/* Right side - Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 lg:p-16">
        <h2 className="text-2xl md:text-3xl mb-2">Create an account</h2>
        <p className="mb-4 text-gray-700 text-sm md:text-base">
          Enter your details to get started
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm md:text-md mt-2 font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 md:p-3 mt-1 border border-gray-500 rounded text-black"
              required
            />
          </div>

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
            <div className="mt-2 text-xs text-gray-600">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm md:text-md mt-2 font-medium text-gray-700"
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
                className="w-full p-2 md:p-3 mt-1 border border-gray-500 rounded pr-10 text-black"
                required
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="currency"
              className="block text-sm md:text-md mt-2 font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 md:p-3 mt-1 border border-gray-500 rounded text-black"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-[#0a6e47] hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-[#0a6e47] text-white py-2 md:py-3 rounded hover:bg-[#054328] transition-colors disabled:opacity-50"
          >
            {isSigningUp ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-[#0a6e47] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
