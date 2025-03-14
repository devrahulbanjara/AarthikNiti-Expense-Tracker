import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-md py-6 px-10 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          <img 
            src="/spendwise.jpg" 
            alt="SpendWise Logo" 
            className="h-12 w-12 rounded-full object-cover" 
          />
          <h1 className="text-3xl font-bold text-gray-100">SpendWise</h1>
        </div>

        <div className="flex space-x-16">
          <a href="#home" className="text-gray-300 hover:text-white hover:underline transition duration-300">
            Home
          </a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white hover:underline transition duration-300">
            How It Works
          </a>
          <a href="#about-us" className="text-gray-300 hover:text-white hover:underline transition duration-300">
            About Us
          </a>
          <a href="#contact" className="text-gray-300 hover:text-white hover:underline transition duration-300">
            Contact
          </a>
        </div>

        <div>
          <Link 
            to="/login" 
            className="px-4 py-2 text-gray-300 hover:text-white hover:underline transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/signUp"
            className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main id="home" className="flex flex-1 items-center justify-center px-24 py-40">
        <div className="w-1/2 flex justify-center">
          <img 
            src="/expense.png" 
            alt="Expense Tracking" 
            className="max-w-lg rounded-lg shadow-lg"
          />
        </div>

        <div className="w-1/2 text-left pl-16">
          <h2 className="text-5xl font-semibold text-gray-100 mb-10">
            Track Your Expenses with Ease
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            SpendWise helps you manage your expenses efficiently. Keep track of 
            your income, expenses, and savings all in one place. With a simple 
            and intuitive interface, managing your finances has never been easier.
          </p>
          <Link
            to="/signUp"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-500 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </main>

      <section id="how-it-works" className="py-24 bg-gray-800 text-center">
        <h2 className="text-4xl font-semibold text-white hover:underline mb-6">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-6">
          SpendWise makes managing your finances simple. Here's how it works:
        </p>
        <div className="text-left text-gray-400 mx-auto max-w-3xl">
          <h3 className="text-2xl font-semibold text-white mb-4 hover:underline">1. Add Your Income</h3>
          <p className="mb-4">
            Start by adding your income sources like salary or freelance work. You can categorize each income entry for better tracking.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4 hover:underline">2. Categorize Your Expenses</h3>
          <p className="mb-4">
            Record your expenses, such as bills or groceries, and create custom categories for easy tracking.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4 hover:underline">3. Analyze Your Spending</h3>
          <p className="mb-4">
            Visualize your expenses and compare your income and spending to make informed financial decisions.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4 hover:underline">4. Set Financial Goals</h3>
          <p className="mb-4">
            Set up goals for savings or paying off debts and track your progress to stay motivated.
          </p>

          <h3 className="text-2xl font-semibold text-white mb-4 hover:underline">5. Get Insights & Reports</h3>
          <p className="mb-4">
            Get a detailed report summarizing your financial activity.
          </p>
        </div>
      </section>

      <section id="about-us" className="py-24 text-center bg-gray-900">
        <h2 className="text-4xl font-semibold text-white hover:underline mb-6">About Us</h2>
        <div className="text-gray-400 max-w-2xl mx-auto text-lg">
          <p className="mb-4">
            SpendWise was created to help people manage their finances with ease, empowering them to make better financial decisions.
          </p>
          <p className="mb-4">
            We provide a simple platform to track income, categorize expenses, and analyze spending patterns, helping you achieve financial stability.
          </p>
          <p className="mb-4">
            Our team is dedicated to improving SpendWise based on user feedback and trends in personal finance.
          </p>
          <p className="mb-4">
            Whether you're saving for a big goal or managing everyday expenses, SpendWise is here to support your financial journey.
          </p>
        </div>
      </section>

      <section id="contact" className="py-24 bg-gray-800 text-center">
        <h2 className="text-4xl font-semibold text-white hover:underline mb-6">Contact Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Have questions or feedback? Reach out to us via email at  
          <a href="mailto:eyashr039@gmail.com" className="text-blue-400 ml-1 hover:underline">
            eyashr039@gmail.com
          </a>  
          <span className="ml-2">or</span> call us at  
          <span className="text-blue-400 ml-1">9841234567</span>.
        </p>
      </section>
    </div>
  );
};

export default Landing;
