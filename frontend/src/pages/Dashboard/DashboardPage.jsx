"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Profile from "../../components/Layout/profile";
import DarkMode from "../../components/Layout/darkmode";
import RecentTransactions from "../../components/Dashboard/recenttransactions";
import ExpensesBreakdown from "../../components/Dashboard/expensesbreakdown";
import UpcomingBills from "../../components/Dashboard/upcomingbills";
import NetSavings from "../../components/Dashboard/netsavings";
import IncomeVsExpensesChart from "../../components/Dashboard/income-expenses-chart";
import ChatAssistant from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [topUIData, setTopUIData] = useState({
    profile_total_income: 0,
    profile_total_expense: 0,
    profile_total_balance: 0,
  });
  const [isTopUILoading, setIsTopUILoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const totalIncome = topUIData.profile_total_income;
  const totalExpenses = topUIData.profile_total_expense;
  const totalBalance = topUIData.profile_total_balance;
  const spentPercentage =
    totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const isOverBudget = spentPercentage > 80;

  const fetchTopUIData = async () => {
    setIsTopUILoading(true);
    try {
      const response = await fetch("http://localhost:8000/profile/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();

      setTopUIData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsTopUILoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchTopUIData();
    const intervalId = setInterval(fetchTopUIData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  if (isTopUILoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Sidebar scrolled={scrolled} />

      <div className="w-4/5 ml-[20%] p-6 min-h-screen relative">
        <Header scrolled={scrolled} handleLogout={handleLogout} />

        <div className="pt-24">
          <DashboardCards
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            spentPercentage={spentPercentage}
            isOverBudget={isOverBudget}
          />

          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-7 h-full">
              <RecentTransactions onTransactionsChange={fetchTopUIData} />
            </div>
            <div className="md:col-span-3 h-full">
              <ExpensesBreakdown totalExpenses={totalExpenses} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6">
            <div className="md:col-span-4 h-full">
              <UpcomingBills />
            </div>
            <div className="md:col-span-6 h-full">
              <NetSavings />
            </div>
          </div>

          <div
            className={`mt-6 border-l-2 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } pl-4`}
          >
            <IncomeVsExpensesChart />
          </div>
        </div>
      </div>

      <ChatAssistant />
    </div>
  );
};

// Header Component
const Header = ({ scrolled, handleLogout }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`fixed top-0 left-1/5 right-0 ${
        darkMode ? "bg-gray-900" : "bg-white"
      } z-30 p-6 transition-all duration-300 ${
        scrolled
          ? `${
              darkMode ? "bg-opacity-80" : "bg-opacity-90"
            } backdrop-blur-sm border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`
          : "bg-opacity-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            View your financial overview and recent activity.
          </p>
        </div>
        <div className="flex space-x-4">
          <DarkMode />
          <Profile handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

// Dashboard Cards Component
const DashboardCards = ({
  totalBalance,
  totalIncome,
  totalExpenses,
  spentPercentage,
  isOverBudget,
}) => {
  const { darkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 -ml-6">
      <Card
        title="Total Balance"
        amount={`$${totalBalance.toFixed(2)}`}
        icon={DollarSign}
      />
      <Card
        title="Total Income"
        amount={`$${totalIncome.toFixed(2)}`}
        icon={ArrowUp}
      />
      <Card
        title="Total Expenses"
        amount={`$${totalExpenses.toFixed(2)}`}
        icon={ArrowDown}
      />
      <BudgetCard percentage={spentPercentage} isOverBudget={isOverBudget} />
    </div>
  );
};

// Card Component
const Card = ({ title, amount, icon: Icon }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-3 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } text-center`}
    >
      <div className="flex items-center justify-between">
        <h2
          className="text-md font-semibold"
          style={{
            color: darkMode ? "white" : "rgba(0, 0, 0, 0.6)", // Full white in dark mode, black with 60% opacity in light mode
          }}
        >
          {title}
        </h2>
        <Icon
          className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        />
      </div>
      <p className="text-2xl font-bold mt-2">{amount}</p>
    </div>
  );
};

// Budget Card Component
const BudgetCard = ({ percentage, isOverBudget }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-3 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } text-center ${isOverBudget ? "scale-95" : ""}`}
    >
      <div className="flex items-center justify-center">
        <h2 className="text-md font-semibold mr-2">Spent</h2>
        <span className="text-lg">🧾</span>
      </div>
      <p className="text-2xl font-bold mt-2">{percentage}%</p>
      <div
        className={`w-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full h-1.5 mt-2 mr-2`}
      >
        <div
          className={`h-1.5 rounded-full ${
            percentage > 80
              ? "bg-red-500"
              : percentage > 60
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardPage;
