import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, PieChart, Wallet, ArrowUpRight, Shield, Clock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation - Fixed position with padding to prevent content collision */}
      <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#065336]">AarthikNiti</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium hover:underline underline-offset-4">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSignIn}
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#065336] px-4 text-sm font-medium text-[#065336] hover:bg-[#065336] hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#065336] px-4 text-sm font-medium text-white shadow hover:bg-[#065336]/90 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Add padding to the top to prevent content from being hidden under the fixed header */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#065336]">
                Your Personal Finance Manager
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Take control of your finances with comprehensive tracking, insightful analytics, and smart budgeting
                tools.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                onClick={handleSignUp}
                className="inline-flex h-10 items-center justify-center rounded-md bg-[#065336] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#065336]/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#065336] px-8 text-sm font-medium text-[#065336] shadow-sm transition-colors hover:bg-[#065336] hover:text-white"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border shadow-lg">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="AarthikNiti Dashboard Preview"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f8f9fa]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg border bg-white shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#065336]/10">
                <Wallet className="h-8 w-8 text-[#065336]" />
              </div>
              <h3 className="text-xl font-bold">Track Finances</h3>
              <p className="text-center text-gray-500">Monitor your income, expenses, and savings in one place</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg border bg-white shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#065336]/10">
                <BarChart3 className="h-8 w-8 text-[#065336]" />
              </div>
              <h3 className="text-xl font-bold">Insightful Analytics</h3>
              <p className="text-center text-gray-500">
                Visualize your financial data with intuitive charts and graphs
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg border bg-white shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#065336]/10">
                <PieChart className="h-8 w-8 text-[#065336]" />
              </div>
              <h3 className="text-xl font-bold">Budget Planning</h3>
              <p className="text-center text-gray-500">Create and manage budgets to achieve your financial goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-[#065336]/10 px-3 py-1 text-sm text-[#065336]">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything you need to manage your finances
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AarthikNiti provides a comprehensive set of tools to help you track, analyze, and optimize your personal
                finances.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#065336]/10">
                      <ArrowUpRight className="h-5 w-5 text-[#065336]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Financial Dashboard</h3>
                      <p className="text-gray-500">
                        Get a complete overview of your financial health with our intuitive dashboard.
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#065336]/10">
                      <BarChart3 className="h-5 w-5 text-[#065336]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Income Tracking</h3>
                      <p className="text-gray-500">Monitor all your income sources and analyze earnings over time.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#065336]/10">
                      <PieChart className="h-5 w-5 text-[#065336]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">Expense Breakdown</h3>
                      <p className="text-gray-500">
                        Categorize and visualize your spending patterns to identify saving opportunities.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mx-auto flex items-center justify-center">
              <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border shadow-lg">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="AarthikNiti Features"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#065336]">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Ready to take control of your finances?
              </h2>
              <p className="max-w-[600px] text-[#e0e0e0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who have transformed their financial management with AarthikNiti.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                onClick={handleSignUp}
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#065336] shadow transition-colors hover:bg-gray-100"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="#pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white hover:text-[#065336]"
              >
                View Pricing
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/10 p-6 text-white">
                <Shield className="h-10 w-10" />
                <h3 className="text-xl font-bold">Secure</h3>
                <p className="text-center text-[#e0e0e0]">Bank-level security for your financial data</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/10 p-6 text-white">
                <Clock className="h-10 w-10" />
                <h3 className="text-xl font-bold">Time-saving</h3>
                <p className="text-center text-[#e0e0e0]">Automate your financial tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-12">
        <div className="container flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#065336]">AarthikNiti</span>
            </div>
            <p className="text-sm text-gray-500">Your Personal Finance Manager</p>
          </div>
          <nav className="flex flex-wrap gap-4 sm:gap-6">
            <a href="#" className="text-sm hover:underline underline-offset-4">
              Terms
            </a>
            <a href="#" className="text-sm hover:underline underline-offset-4">
              Privacy
            </a>
            <a href="#" className="text-sm hover:underline underline-offset-4">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AarthikNiti. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;