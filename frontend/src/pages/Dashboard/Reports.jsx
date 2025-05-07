"use client";

import React from "react";
import Sidebar from "../../components/Layout/sidebar";
import IncomeChart from "../../components/Reports/income-chart";
import ExpensesChart from "../../components/Reports/expenses-chart";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import DownloadReport from "../../components/Reports/download-report";

const Reports = () => {
  const { darkMode } = useTheme();

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        body: JSON.stringify({
          transaction_type: "all",
          months: 3,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch CSV data");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };  

  return (
    <div className={`flex ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
      <Sidebar active="reports" />

      <main className="flex-grow p-6 md:ml-[20%] min-h-screen pt-16">
        <Header title="Reports" subtitle="Explore your income and expenses trends over time." />

        {/* Download Button */}
        <div className="flex justify-end mt-12 mb-4">
          <DownloadReport onClick={handleDownload} />
        </div>

        <div className="mt-6 w-full h-[400px]">
          <IncomeChart />
        </div>

        <div className="w-full h-[400px] mt-8">
          <ExpensesChart />
        </div>
      </main>
    </div>
  );
};

export default Reports;
