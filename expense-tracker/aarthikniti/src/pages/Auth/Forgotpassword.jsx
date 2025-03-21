import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    
    setError("");
    setMessage("A password reset link has been sent to your email.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password?</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email address below, and we'll send you a password reset link.
        </p>
        
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
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
            className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700"
          >
            Send Reset Link
          </button>
        </form>
        
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