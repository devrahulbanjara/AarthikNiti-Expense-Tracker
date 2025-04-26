import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/auth/forgot-password`, { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!otp) {
      setError("OTP is required");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/auth/verify-otp`, { email, otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.detail || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/auth/reset-password`, {
        email,
        otp,
        new_password: newPassword
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password?</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your email address below, and we'll send you an OTP to reset your password.
            </p>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-md font-medium text-gray-700">
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
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter the OTP sent to your email.
            </p>
            
            <div className="mb-4">
              <label htmlFor="otp" className="block text-md font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-500 rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your new password.
            </p>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-md font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-500 rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-md font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-500 rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <Link to="/login" className="text-green-800 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
