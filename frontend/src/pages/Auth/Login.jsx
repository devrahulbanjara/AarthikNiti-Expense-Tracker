import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";
import girlImg from "../../assets/ExtraImg/girl.jpg";
import googleLogoImg from "../../assets/ExtraImg/google.png";
import { GoogleLogin } from "react-google-login";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
  
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      toast.success("Google login successful!");
      navigate("/dashboard");
    } else {
      localStorage.removeItem("token");
    }
  }, [navigate]);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Enter a valid email (e.g., example@mail.com)");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed. Try again.");
    }
  };

  const responseGoogle = async (response) => {
    try {
      if (response.error) {
        toast.error("Google login failed!");
        return;
      }

      const { tokenId } = response;
      const res = await axios.post("http://localhost:8000/auth/google/login", { token: tokenId });

      localStorage.setItem("token", res.data.access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f5f5]">
      <div className="w-full md:w-1/2 bg-[#065336] text-white flex flex-col items-start justify-between p-8 md:p-16">
        <img src={aarthiknitiImg} alt="Logo" className="w-30 h-30 sm:w-48 sm:h-48" />
        <img src={girlImg} alt="Illustration" className="w-4/5 h-auto mt-4 mx-auto" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
        <h2 className="text-3xl mb-2">Welcome back</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-md font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" required />
          </div>
          <div className="mb-4 relative">
            <label className="block text-md font-medium">Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded pr-10" required />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </span>
          </div>
          <button type="submit" className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700">Sign In</button>
          <GoogleLogin clientId="361032185818-t4kevfj66mjlcjj81qbsg06v2ahi94k7" buttonText="Login with Google" onSuccess={responseGoogle} onFailure={responseGoogle} cookiePolicy="single_host_origin" className="w-full py-3 bg-gray-300 text-black rounded flex items-center justify-center mt-4" />
        </form>
      </div>
    </div>
  );
}

export default Login;