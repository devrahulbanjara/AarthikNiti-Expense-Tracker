import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&*])(?=.*[A-Z])[A-Za-z\d@#&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
  
    if (!email.includes("@")) {
      setError("Email must include '@'");
      return;
    }
  
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long with a letter, number & special character."
      );
      return;
    }
  
    setError("");
    alert("Login successful!");
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-[#065336] text-white flex flex-col items-start justify-between p-8">
        <div className="flex flex-col items-start justify-center w-full h-full mb-4 border-b border-white">
          <img
            src="aarthikniti.png"
            alt="Logo"
            className="w-40 h-40 absolute top-[-30px] left-3 mb-0 sm:w-48 sm:h-48 sm:mb-0"
          />
          <img
            src="hands.jpg"
            alt="Image Description"
            className="w-4/5 h-auto mx-auto sm:w-3/4 sm:h-100 sm:mx-auto"
          />
        </div>
        <p className="text-center mb-5">
          Save, track, and grow your wealth with Aarthikniti. Aarthikniti makes
          managing your finances simple, helping you track expenses, set
          budgets, and achieve your financial goals effortlessly.
        </p>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl mb-2">Welcome back</h2>
        <p className="mb-4 text-gray-700">
          Enter your credentials to sign in to your account
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md"
          onKeyDown={handleKeyDown}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-md mt-2 font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-md mt-2 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-green-800 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-800 text-white rounded mb-4 hover:bg-green-700 cursor-pointer"
          >
            Sign In
          </button>

          <div className="flex items-center justify-center mb-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="mx-4 text-sm">or continue with</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          <button
            type="button"
            className="w-full py-3 bg-gray-300 text-black rounded mb-4 flex items-center hover:bg-gray-400 justify-center cursor-pointer"
            onClick={() => window.location.href = "google authentication url"}
          >
            <img src="google.png" alt="Google Icon" className="w-6 h-6 mr-2" />
            Google
          </button>

          <p className="text-sm flex items-center justify-center mt-4">
            <Link to="/signup" className="text-green-800 hover:underline ml-2 mt-2">
              Don't have an account? Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
