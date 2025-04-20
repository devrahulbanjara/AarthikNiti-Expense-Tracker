import { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const ExpensesPage = () => {
  const { darkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex flex-col md:flex-row ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Sidebar scrolled={scrolled} />

      <div className="w-full md:w-4/5 md:ml-[20%] p-4 md:p-6 min-h-screen relative">
        {/* Using the reusable Header component for Expenses page */}
        <Header 
          title="Expenses" 
          subtitle="Manage your expenses and track your spending."
        />

        <div className="pt-28 md:pt-28">
          {/* Expenses page content goes here */}
          <div className={`p-6 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
            {/* Expenses content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage; 