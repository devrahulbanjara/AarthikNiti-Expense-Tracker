"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const currencies = [
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "INR", name: "Indian Rupee (₹)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" },
    { code: "CNY", name: "Chinese Yuan (¥)" },
  ]

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&*])(?=.*[A-Z])[A-Za-z\d@#&*]{8,}$/
    return passwordRegex.test(password)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name) return setError("Name is required")
    if (!email) return setError("Email is required")
    if (!password) return setError("Password is required")
    if (!email.includes("@")) return setError("Email must include '@'")
    if (!validatePassword(password)) return setError("Password must be at least 8 characters long with a letter, number & special character.")
    if (password !== confirmPassword) return setError("Passwords do not match")

    setError("")
    alert("Signup successful!")
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Left Panel */}
      <div className="w-screen sm:w-1/2 bg-[#065336] text-white flex flex-col items-start justify-between p-8">
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
        Track it before it disappears into the abyss of 'Where did all my money go?'
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-screen sm:w-1/2 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl mb-2 mt-4">Create an account</h2>
        <p className="mb-4 text-gray-700">Enter your details to sign up</p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-md mt-2 font-medium text-gray-700">
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

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block text-md mt-2 font-medium text-gray-700">
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
            <label htmlFor="currency" className="block text-md mt-2 font-medium text-gray-700">
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
                I agree to the Terms & Conditions
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-800 text-white rounded mb-4 hover:bg-green-700 cursor-pointer"
          >
            Sign Up
          </button>

          <p className="text-sm flex items-center justify-center">
  <Link to="/login" className="text-green-800 hover:underline ml-2" style={{ marginTop: '0.25rem' }}>
    Already have an account? Sign In
  </Link>
</p>

        </form>
      </div>
    </div>
  )
}

export default Signup