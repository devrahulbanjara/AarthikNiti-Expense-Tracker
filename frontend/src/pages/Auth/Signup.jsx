import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const navigate = useNavigate();

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
    const errors = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return setError("Name is required");
    if (!email) return setError("Email is required");
    if (!validateEmail(email))
      return setError("Please enter a valid email address.");
    if (!password) return setError("Password is required");
    if (!validatePassword(password))
      return setError("Password does not meet the requirements.");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!termsAccepted)
      return setError("You must agree to the terms and conditions");

    setError("");

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
        setError("Email already exists. Please login instead.");
        toast.error("Email already exists. Please login instead.");
      } else {
        const errorMessage =
          error.response?.data?.detail || "Signup failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f5f5]">
      <div className="w-full md:w-1/2 bg-[#065336] text-white flex flex-col items-start justify-between p-8 md:p-16">
        <div className="flex flex-col items-start justify-center w-full h-full mb-4 border-b border-white pb-4 sm:pb-8">
          <img
            src={aarthiknitiImg}
            alt="Logo"
            className="w-30 h-30 sm:w-48 sm:h-48 md:w-45 md:h-45 absolute top-[-30px] left-2 mb-0 sm:mb-4"
          />
          <img
            src={girlImg}
            alt="Image Description"
            className="w-4/5 h-auto mt-4 mx-auto sm:w-50 sm:h-50 sm:mx-auto md:w-3/4 md:h-auto"
          />
        </div>
        <p className="text-center text-xs mb-0 sm:mb-0 md:mb-5 sm:text-xs md:text-lg">
          Save, track, and grow your wealth with Aarthikniti. This makes
          managing your finances simple, helping you track expenses, set
          budgets, and achieve your financial goals effortlessly.
        </p>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl mb-2 mt-4">Create an account</h2>
        <p className="mb-4 text-gray-700">Enter your details to sign up</p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-md mt-2 font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-500 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-md mt-2 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-500 rounded"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-md mt-2 font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 mt-1 border border-gray-500 rounded pr-10"
                required
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p
                className={
                  passwordErrors.length ? "text-green-600" : "text-red-600"
                }
              >
                • At least 8 characters long
              </p>
              <p
                className={
                  passwordErrors.uppercase ? "text-green-600" : "text-red-600"
                }
              >
                • At least one uppercase letter
              </p>
              <p
                className={
                  passwordErrors.number ? "text-green-600" : "text-red-600"
                }
              >
                • At least one number
              </p>
              <p
                className={
                  passwordErrors.symbol ? "text-green-600" : "text-red-600"
                }
              >
                • At least one special character
              </p>
            </div>
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-md mt-2 font-medium text-gray-700"
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
                className="w-full p-3 mt-1 border border-gray-500 rounded pr-10"
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
              className="block text-md mt-2 font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-500 rounded"
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
                <Link to="/terms" className="text-[#065336] hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#065336] text-white py-3 rounded hover:bg-[#054328] transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-green-800 hover:underline">
            Already have an account? Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
