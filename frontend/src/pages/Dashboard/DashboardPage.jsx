"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, DollarSign, Percent } from "lucide-react";
import Sidebar from "../../components/Layout/sidebar";
import Header from "../../components/Layout/Header";
import RecentTransactions from "../../components/Dashboard/recenttransactions";
import ExpensesBreakdown from "../../components/Dashboard/expensesbreakdown";
import UpcomingBills from "../../components/Dashboard/upcomingbills";
import NetSavings from "../../components/Dashboard/netsavings";
import IncomeVsExpensesChart from "../../components/Dashboard/income-expenses-chart";
import ChatAssistant from "../../components/Chatbot/chat-assistant";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { logout, getToken } = useAuth();
  const { currency, formatCurrency, convertAmount } = useCurrency();
  const [topUIData, setTopUIData] = useState({
    profile_total_income: 0,
    profile_total_expense: 0,
    profile_total_balance: 0,
  });
  const [isTopUILoading, setIsTopUILoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const totalIncome = topUIData.profile_total_income;
  const totalExpenses = topUIData.profile_total_expense;
  const totalBalance = topUIData.profile_total_balance;
  const spentPercentage =
    totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const isOverBudget = spentPercentage > 80;

  const fetchTopUIData = async () => {
    setIsTopUILoading(true);
    try {
      const token = getToken();
      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${BACKEND_URL}/profile/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();
      setTopUIData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.message === "Failed to fetch dashboard data") {
        logout();
      }
    } finally {
      setIsTopUILoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Add staggered animations
    setIsPageLoaded(true);

    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 300);

    const chartsTimer = setTimeout(() => {
      setShowCharts(true);
    }, 600);

    return () => {
      clearTimeout(cardsTimer);
      clearTimeout(chartsTimer);
    };
  }, []);

  useEffect(() => {
    fetchTopUIData();
    const intervalId = setInterval(fetchTopUIData, 300000);
    return () => clearInterval(intervalId);
  }, [currency]);

  if (isTopUILoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col md:flex-row ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <Sidebar scrolled={scrolled} />

      <div
        className={`w-full md:w-4/5 md:ml-[20%] p-3 md:p-6 min-h-screen relative transition-opacity duration-500 ease-out ${
          isPageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Header
          title="Dashboard"
          subtitle="View your financial overview and recent activity."
        />

        <div className="pt-24 md:pt-28">
          {/* Dashboard Cards with fade-in */}
          <div
            className={`transition-all duration-500 delay-200 ease-out ${
              showCards
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <DashboardCards
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              spentPercentage={spentPercentage}
              isOverBudget={isOverBudget}
            />
          </div>

          {/* First row of charts with fade-in */}
          <div
            className={`grid grid-cols-1 md:grid-cols-10 gap-3 md:gap-6 mt-3 md:mt-6 transition-all duration-700 delay-300 ease-out ${
              showCharts
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="md:col-span-7 h-full">
              <RecentTransactions onTransactionsChange={fetchTopUIData} />
            </div>
            <div className="md:col-span-3 h-full">
              <ExpensesBreakdown totalExpenses={totalExpenses} />
            </div>
          </div>

          {/* Second row of charts with fade-in */}
          <div
            className={`grid grid-cols-1 md:grid-cols-10 gap-3 md:gap-6 mt-3 md:mt-6 transition-all duration-700 delay-500 ease-out ${
              showCharts
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="md:col-span-4 h-full">
              <UpcomingBills />
            </div>
            <div className="md:col-span-6 h-full">
              <NetSavings />
            </div>
          </div>

          {/* Bottom chart with fade-in */}
          <div
            className={`mt-3 md:mt-6 transition-all duration-700 delay-700 ease-out ${
              showCharts
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <IncomeVsExpensesChart />
          </div>
        </div>
      </div>

      <ChatAssistant darkMode={darkMode} />
    </div>
  );
};

const DashboardCards = ({
  totalBalance,
  totalIncome,
  totalExpenses,
  spentPercentage,
  isOverBudget,
}) => {
  const { darkMode } = useTheme();
  const { currency, formatCurrency, convertAmount } = useCurrency();

  // Convert all amounts to the selected currency
  const convertedBalance = convertAmount(totalBalance, "NPR");
  const convertedIncome = convertAmount(totalIncome, "NPR");
  const convertedExpenses = convertAmount(totalExpenses, "NPR");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2">
      <Card
        title="Total Balance"
        amount={formatCurrency(convertedBalance)}
        icon={DollarSign}
      />
      <Card
        title="Total Income"
        amount={formatCurrency(convertedIncome)}
        icon={ArrowUp}
        iconBg="bg-green-100"
        iconColor="text-green-600"
      />
      <Card
        title="Total Expenses"
        amount={formatCurrency(convertedExpenses)}
        icon={ArrowDown}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />
      <BudgetCard percentage={spentPercentage} isOverBudget={isOverBudget} />
    </div>
  );
};

const Card = ({ title, amount, icon: Icon, iconBg, iconColor }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-3 md:p-5 rounded-xl border transition-colors duration-200 ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
          : "bg-white border-gray-200 hover:bg-gray-50"
      } hover:shadow-md`}
    >
      <div className="flex items-center mb-2">
        <div
          className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 ${
            iconBg || (darkMode ? "bg-blue-900/30" : "bg-blue-100")
          }`}
        >
          <Icon
            className={`w-3.5 h-3.5 md:w-5 md:h-5 ${
              iconColor || (darkMode ? "text-blue-400" : "text-blue-600")
            }`}
          />
        </div>
        <span className="text-xs md:text-sm font-medium">{title}</span>
      </div>
      <div className="mt-1 text-center md:text-left">
        <div className="text-sm md:text-xl font-semibold">{amount}</div>
      </div>
    </div>
  );
};

const BudgetCard = ({ percentage, isOverBudget }) => {
  const { darkMode } = useTheme();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const getPercentColor = () => {
    if (darkMode) {
      if (percentage > 80) return "#ef4444";
      if (percentage > 60) return "#fbbf24";
      return "#4ade80";
    } else {
      if (percentage > 80) return "#ef4444";
      if (percentage > 60) return "#f59e0b";
      return "#0a6e47";
    }
  };

  useEffect(() => {
    const duration = 1500;
    const frameRate = 20;
    const increment = percentage / (duration / frameRate);
    let currentValue = 0;

    setProgressWidth(0);

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= percentage) {
        clearInterval(timer);
        setAnimatedPercentage(percentage);
        setTimeout(() => setProgressWidth(percentage), 50);
      } else {
        setAnimatedPercentage(Math.round(currentValue));
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [percentage]);

  const percentColor = getPercentColor();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } p-3 rounded-lg border ${
        darkMode ? "border-gray-700" : "border-gray-300"
      } text-center transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fadeIn`}
    >
      <div className="flex items-center justify-between">
        <h2
          className="text-xs md:text-md font-semibold"
          style={{
            color: darkMode ? "white" : "rgba(0, 0, 0, 0.6)",
          }}
        >
          Spent
        </h2>
        <Percent
          className="h-4 w-4 md:h-5 md:w-5 transform transition-all duration-700 hover:rotate-12 hover:scale-110 animate-pulse"
          style={{
            color: percentColor,
            animationDuration: "3s",
          }}
        />
      </div>
      <p
        className="text-lg md:text-2xl font-bold mt-2 relative"
        style={{ color: percentColor }}
      >
        <span className="inline-block tabular-nums transition-all">
          {animatedPercentage}
        </span>
        <span className="ml-1">%</span>
        {isOverBudget && (
          <span
            className="absolute -top-1 -right-1 text-xs px-1 animate-pulse rounded-full"
            style={{ backgroundColor: percentColor, color: "white" }}
          >
            !
          </span>
        )}
      </p>
      <div
        className={`w-full ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded-full h-2 mt-3 overflow-hidden relative`}
      >
        <div
          className="h-2 rounded-full absolute left-0 top-0 transition-none"
          style={{
            width: `${progressWidth}%`,
            backgroundColor: percentColor,
            boxShadow: isOverBudget ? `0 0 10px ${percentColor}` : "none",
            transitionProperty: "width",
            transitionDuration: "1.5s",
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardPage;
