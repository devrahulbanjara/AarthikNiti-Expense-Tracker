import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in...');
  };

  const handlePasswordReset = () => {
    console.log('Password Reset');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/spendwise.jpg"
            alt="SpendWise Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-semibold text-center mb-4">Sign In to SpendWise</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition mb-4"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handlePasswordReset}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-400 transition mb-4"
          >
            Forgot Password?
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signUp" className="text-blue-400 hover:text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
