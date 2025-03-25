import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import googleLogoImg from "../../assets/ExtraImg/google.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessTokenFromURL = urlParams.get("access_token");
  
    if (accessTokenFromURL) {
      localStorage.setItem("access_token", accessTokenFromURL);
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      const accessToken = localStorage.getItem("access_token");
  
      if (accessToken) {
        axios
          .get("http://localhost:8000/auth/validate-token", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            if (response.data.valid) {
              navigate("/dashboard");
            }
          })
          .catch(() => {
            localStorage.removeItem("access_token");
          });
      }
    }
  }, [navigate]);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
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
    window.location.href = "http://localhost:8000/auth/google/login";
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
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
        <h2 className="text-3xl sm:text-2xl md:text-3xl mb-2">Welcome back</h2>
        <p className="mb-4 text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
          Enter your credentials to sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
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
            <Link
              to="/forgotpw"
              className="text-sm text-green-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-800 text-white rounded mb-4 hover:bg-green-700 cursor-pointer"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging In..." : "Sign In"}
          </button>
          <div className="flex items-center justify-center mb-4">
            <hr className="w-1/4 sm:w-1/3 border-gray-300" />
            <span className="mx-4 text-xs sm:text-xs md:text-sm">
              or continue with
            </span>
            <hr className="w-1/4 sm:w-1/3 border-gray-300" />
          </div>
          <button
            type="button"
            className="w-full py-3 bg-gray-300 text-black rounded mb-4 flex items-center hover:bg-gray-400 justify-center cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <img
              src={googleLogoImg}
              alt="Google Icon"
              className="w-6 h-6 mr-2"
            />
            Google
          </button>
          <p className="text-sm flex items-center justify-center mt-4">
            <Link
              to="/signup"
              className="text-green-800 hover:underline ml-2 mt-2"
            >
              Don't have an account? Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
