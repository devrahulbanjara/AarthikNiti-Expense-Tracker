"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import DownloadReport from "../../components/Reports/download-report";
import AllTimeIncomeChart from "../../components/Reports/all-time-income-chart";
import AllTimeExpenseChart from "../../components/Reports/all-time-expense-chart";
import ChatAssistant from "../../components/Chatbot/chat-assistant";
import { useCurrency } from "../../context/CurrencyContext";

const Reports = () => {
  const { darkMode } = useTheme();
  const { currency, formatCurrency, convertAmount } = useCurrency();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll effect for header
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Trigger page load animation
    setIsPageLoaded(true);

    // Delay showing charts for staggered effect
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen transition-colors duration-300`}
    >
      <Sidebar active="reports" scrolled={scrolled} />

      <div className="w-full md:w-4/5 md:ml-[20%] p-4 md:p-6 min-h-screen relative">
        <Header
          title="Reports"
          subtitle="Explore your income and expenses trends over time."
        />

        <div
          className={`pt-28 md:pt-28 transition-opacity duration-500 ease-out ${
            isPageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Content container with better layout */}
          <div
            className={`rounded-xl shadow-lg p-6 transform transition-all duration-500 ease-out ${
              darkMode
                ? "bg-gray-800/50 backdrop-blur-sm"
                : "bg-white/80 backdrop-blur-sm shadow-gray-200/60"
            } ${
              isPageLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div
                className={`transition-all duration-500 ease-out ${
                  isPageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <h2 className="text-2xl font-bold mb-2">Financial Reports</h2>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Visualize your transaction history and download detailed
                  reports
                </p>
              </div>

              {/* Download Button with animation */}
              <div
                className={`relative z-20 mt-4 md:mt-0 transition-all duration-300 hover:shadow-md active:scale-95 ${
                  isPageLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <DownloadReport />
              </div>
            </div>

            {/* Chart sections with animations */}
            <div
              className={`mb-8 transition-all duration-700 delay-300 ease-out ${
                showCharts
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="w-full h-[400px]">
                <AllTimeIncomeChart
                  currency={currency}
                  formatCurrency={formatCurrency}
                  convertAmount={convertAmount}
                />
              </div>
            </div>

            <div
              className={`mt-8 transition-all duration-700 delay-500 ease-out ${
                showCharts
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="w-full h-[400px]">
                <AllTimeExpenseChart
                  currency={currency}
                  formatCurrency={formatCurrency}
                  convertAmount={convertAmount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot integration */}
      <ChatAssistant darkMode={darkMode} />
    </div>
  );
};

export default Reports;
