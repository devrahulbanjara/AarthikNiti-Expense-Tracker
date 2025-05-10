import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  PieChart,
  Wallet,
  ArrowUpRight,
  Shield,
  Clock,
  Quote,
  ChevronDown,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import dashboardVideo from "../../assets/Videos/dashboard-preview.mp4";
import lpImage from "../../assets/ExtraImg/lpimage.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTheme } from "../../context/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Navigation - Simplified and Guaranteed Visible */}
      <header className="fixed top-0 w-full bg-[#065336] shadow-md p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white" data-aos="fade-down">
            AarthikNiti
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a
                href="#features"
                className="font-medium text-white hover:text-white/80 transition-colors"
                data-aos="fade-down"
                data-aos-delay="100"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="font-medium text-white hover:text-white/80 transition-colors"
                data-aos="fade-down"
                data-aos-delay="150"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="font-medium text-white hover:text-white/80 transition-colors"
                data-aos="fade-down"
                data-aos-delay="200"
              >
                FAQ
              </a>
            </nav>
            <div
              className="flex space-x-4"
              data-aos="fade-down"
              data-aos-delay="250"
            >
              <button
                onClick={handleSignIn}
                className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-[#065336] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-white text-[#065336] rounded-md hover:bg-white/90 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-[#065336] shadow-lg transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col p-4 space-y-4">
            <a
              href="#features"
              className="font-medium text-white hover:text-white/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="font-medium text-white hover:text-white/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="font-medium text-white hover:text-white/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="flex flex-col space-y-3 pt-2 border-t border-white/20">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="w-full px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-[#065336] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignUp();
                }}
                className="w-full px-4 py-2 bg-white text-[#065336] rounded-md hover:bg-white/90 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </header>
      <div className="pt-16"></div> {/* Spacer for fixed header */}
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1
              className={`text-4xl font-bold tracking-tight ${
                darkMode ? "text-[#0a7a56]" : "text-[#065336]"
              } sm:text-5xl md:text-6xl`}
              data-aos="fade-right"
            >
              Your Personal <span className="text-[#0a7a56]">Finance</span>{" "}
              Manager
            </h1>
            <p
              className={`mt-4 text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Take control of your finances with comprehensive tracking,
              insightful analytics, and smart budgeting tools.
            </p>
            <div
              className="mt-8 flex gap-4"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <button
                onClick={handleSignUp}
                className="flex items-center gap-2 rounded-md bg-[#065336] px-6 py-3 text-white hover:bg-[#065336]/90 transition-all hover:scale-105 cursor-pointer"
              >
                Get Started <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className={`flex items-center gap-2 rounded-md border border-[#065336] px-6 py-3 ${
                  darkMode
                    ? "text-[#0a7a56] hover:bg-[#065336] hover:text-white"
                    : "text-[#065336] hover:bg-[#065336] hover:text-white"
                } transition-all`}
              >
                Learn More
              </a>
            </div>
          </div>
          <div
            className="rounded-xl border shadow-lg overflow-hidden"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <video autoPlay loop muted playsInline className="w-full h-auto">
              <source src={dashboardVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section
        className={`w-full py-12 md:py-24 lg:py-32 ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <Wallet
                    size={32}
                    className={`${
                      darkMode ? "text-green-400" : "text-[#065336]"
                    }`}
                  />
                ),
                title: "Track Finances",
                description:
                  "Monitor your income, expenses, and savings in one place",
              },
              {
                icon: (
                  <BarChart3
                    size={32}
                    className={`${
                      darkMode ? "text-green-400" : "text-[#065336]"
                    }`}
                  />
                ),
                title: "Insightful Analytics",
                description:
                  "Visualize your financial data with intuitive charts and graphs",
              },
              {
                icon: (
                  <PieChart
                    size={32}
                    className={`${
                      darkMode ? "text-green-400" : "text-[#065336]"
                    }`}
                  />
                ),
                title: "Budget Planning",
                description:
                  "Create and manage budgets to achieve your financial goals",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${
                  darkMode
                    ? "bg-gray-700 hover:shadow-gray-600"
                    : "bg-white hover:shadow-md"
                } p-8 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full ${
                    darkMode ? "bg-gray-800" : "bg-[#065336]/10"
                  } mb-4`}
                >
                  {item.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-gray-200" : ""
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`w-full py-12 md:py-24 lg:py-32 ${
          darkMode ? "bg-gray-900" : "bg-[#065336]/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-[#0a7a56]" : "text-[#065336]"
              }`}
              data-aos="fade-up"
            >
              What Our Users Say
            </h2>
            <p
              className={`mt-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Hear from people who have transformed their financial management
              with AarthikNiti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "AarthikNiti completely changed how I manage my finances. I've saved 20% more since I started using it!",
                author: "Prajwal Dahal",
                role: "Cloud Engineer",
              },
              {
                quote:
                  "The budgeting tools are incredibly intuitive. I finally understand where my money goes each month.",
                author: "Shreeya Pandey",
                role: "Marketing Manager",
              },
              {
                quote:
                  "As a freelancer, tracking irregular income was a challenge. AarthikNiti made it simple and stress-free.",
                author: "Rahul Dev Banjara",
                role: "Machine Learning Engineer",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`${
                  darkMode
                    ? "bg-gray-800 hover:shadow-gray-700"
                    : "bg-white hover:shadow-lg"
                } p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="flex items-start mb-4">
                  <Quote className="text-[#065336] mr-2 mt-1" />
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } italic`}
                  >
                    {testimonial.quote}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#065336]">
                    {testimonial.author}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section
        id="features"
        className={`w-full py-12 md:py-24 lg:py-32 ${
          darkMode ? "bg-gray-900" : ""
        }`}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl mx-auto">
              <div
                className={`inline-block rounded-lg ${
                  darkMode
                    ? "bg-[#065336]/30 text-green-400"
                    : "bg-[#065336]/10 text-[#065336]"
                } px-3 py-1 text-sm`}
                data-aos="fade-up"
              >
                Features
              </div>
              <h2
                className={`text-3xl font-bold tracking-tighter md:text-4xl/tight ${
                  darkMode ? "text-gray-200" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Everything you need to manage your finances
              </h2>
              <p
                className={`max-w-[900px] ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto`}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                AarthikNiti provides a comprehensive set of tools to help you
                track, analyze, and optimize your personal finances.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 mx-auto lg:mx-0">
              <ul className="grid gap-6 mx-auto w-full max-w-lg lg:max-w-none">
                {[
                  {
                    icon: (
                      <ArrowUpRight
                        className={`h-5 w-5 ${
                          darkMode ? "text-green-400" : "text-[#065336]"
                        }`}
                      />
                    ),
                    title: "Financial Dashboard",
                    description:
                      "Get a complete overview of your financial health with our intuitive dashboard.",
                  },
                  {
                    icon: (
                      <BarChart3
                        className={`h-5 w-5 ${
                          darkMode ? "text-green-400" : "text-[#065336]"
                        }`}
                      />
                    ),
                    title: "Income Tracking",
                    description:
                      "Monitor all your income sources and analyze earnings over time.",
                  },
                  {
                    icon: (
                      <PieChart
                        className={`h-5 w-5 ${
                          darkMode ? "text-green-400" : "text-[#065336]"
                        }`}
                      />
                    ),
                    title: "Expense Breakdown",
                    description:
                      "Categorize and visualize your spending patterns to identify saving opportunities.",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    data-aos="fade-right"
                    data-aos-delay={index * 100}
                    className="mx-auto w-full"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          darkMode ? "bg-gray-800" : "bg-[#065336]/10"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <h3
                          className={`text-xl font-bold ${
                            darkMode ? "text-gray-200" : ""
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="mx-auto flex items-center justify-center"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <img
                  src={lpImage}
                  alt="AarthikNiti Features"
                  className="w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section
        id="faq"
        className={`w-full py-12 md:py-24 lg:py-32 ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-[#0a7a56]" : "text-[#065336]"
              }`}
              data-aos="fade-up"
            >
              Frequently Asked Questions
            </h2>
            <p
              className={`mt-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto`}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Find answers to common questions about AarthikNiti.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How secure is my financial data?",
                answer:
                  "We use bank-level encryption and security protocols to protect your data. Your information is never shared with third parties without your consent.",
              },
              {
                question: "Is there a mobile app available?",
                answer: "Mobile App is not available currently.",
              },
              {
                question: "Can I connect my bank accounts?",
                answer:
                  "No, but we plan to add this feature in the near future. For now, you can manually enter your transactions.",
              },
              {
                question: "How does the budgeting feature work?",
                answer:
                  "Our budgeting tool allows you to set monthly limits for different categories. The system tracks your spending and alerts you when you're approaching your limits.",
              },
              {
                question: "Is there a free version available?",
                answer:
                  "Yes, this is an all free version for now. You can access all features without any cost.",
              },
              {
                question: "How often is my financial data updated?",
                answer:
                  "For connected accounts, data is typically updated within a few hours. You can also manually update at any time.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className={`group ${
                  darkMode
                    ? "bg-gray-700 hover:shadow-gray-600"
                    : "bg-white hover:shadow-md"
                } p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <summary className="flex justify-between items-center cursor-pointer">
                  <h3
                    className={`font-medium ${
                      darkMode ? "text-[#0a7a56]" : "text-[#065336]"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 ${
                      darkMode ? "text-[#0a7a56]" : "text-[#065336]"
                    } transform group-open:rotate-180 transition-transform`}
                  />
                </summary>
                <p
                  className={`mt-4 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#065336]">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2
                className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl"
                data-aos="fade-up"
              >
                Ready to take control of your finances?
              </h2>
              <p
                className="text-[#e0e0e0] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Join thousands of users who have transformed their financial
                management with AarthikNiti.
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button
                onClick={handleSignUp}
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#065336] shadow transition-all hover:bg-gray-100 hover:scale-105 cursor-pointer"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-white hover:text-[#065336]"
              >
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/10 p-6 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <Shield className="h-10 w-10" />
                <h3 className="text-xl font-bold">Secure</h3>
                <p className="text-center text-[#e0e0e0]">
                  Bank-level security for your financial data
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 rounded-lg bg-white/10 p-6 text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                <Clock className="h-10 w-10" />
                <h3 className="text-xl font-bold">Time-saving</h3>
                <p className="text-center text-[#e0e0e0]">
                  Automate your financial tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Gap between CTA and Footer */}
      <div className={`h-12 ${darkMode ? "bg-gray-900" : "bg-white"}`}></div>
      {/* Enhanced Footer */}
      <footer className="w-full bg-[#065336] text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <span className="mr-2">AarthikNiti</span>
              </h3>
              <p className="text-gray-300">
                Your personal finance manager to track, analyze, and optimize
                your financial health.
              </p>
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} AarthikNiti. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
