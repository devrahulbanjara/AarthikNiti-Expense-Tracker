import React, { useState } from "react";
import aarthiknitiImg from "../../assets/Logo/aarthikniti.png";

const FinancialDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}>
      <div className="flex">
        
        {/* Sidebar */}

        <div className={`w-1/5 ${darkMode ? "bg-gray-800" : "bg-[#065336]"} text-white flex flex-col items-start  p-8 relative min-h-screen  `}>
       <div>

        <img
                src={aarthiknitiImg}
                alt="Logo"
                className="w-30 h-30 sm:w-48 sm:h-48 md:w-45 md:h-45 absolute top-[-30px] left-2 mb-0 sm:mb-4 "
                />
                </div>
                <div>

          <ul className="w-full mt-13"> 

            <li className="py-2 px-4 bg-green-700 rounded-md mb-2">Dashboard</li>
            <li className="py-2 px-4 hover:bg-green-600 rounded-md">Income</li>
            <li className="py-2 px-4 hover:bg-green-600 rounded-md">Expenses</li>
            <li className="py-2 px-4 hover:bg-green-600 rounded-md">Reports</li>
            <li className="py-2 px-4 hover:bg-green-600 rounded-md">Budgeting & Alerts</li>
          </ul>
                </div>
          </div>


        {/* Main Content */}
        <div className={`w-4/5 p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} `}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex space-x-4">
              <button 
                className="p-2 rounded-full" 
                onClick={() => setDarkMode(!darkMode)}
                style={{ backgroundColor: darkMode ? "#fff" : "#333", color: darkMode ? "#000" : "#fff" }}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button className="p-2 bg-gray-200 rounded-full">👤</button>
            </div>
          </div>
          <p className="text-gray-600">View your financial overview and recent activity.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <Card title="Total Balance" amount="$12,546.00" change="+2.5% from last month" icon="⚖️" darkMode={darkMode} />
            <Card title="Total Income" amount="$4,935.00" change="+10.1% from last month" icon="📈" darkMode={darkMode} />
            <Card title="Total Expenses" amount="$2,640.00" change="+3.2% from last month" icon="📉" darkMode={darkMode} />
            <BudgetCard percentage={53.5}  darkMode={darkMode} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <RecentTransactionsCard darkMode={darkMode} />
            <ExpensesBreakdownCard darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, amount, change, icon, darkMode }) => {
  return (
    <div className={`p-3 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold">{title}</h2>
        <span>{icon}</span>
      </div>
      <p className="text-xl font-bold mt-2">{amount}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
};

const BudgetCard = ({ percentage, label, darkMode }) => {
  return (
    <div className={`p-3 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold">Spent</h2>
        <span role="img" aria-label="money-bag" className="ml-2">💰</span>
      </div>
      <p className="text-xl font-bold mt-2">{percentage}%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 relative overflow-hidden">
        <div className="bg-blue-500 h-2.5 rounded-full transition-all hover:bg-blue-700" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
};

const RecentTransactionsCard = ({ darkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} `}>
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul>
        <li className="flex justify-between py-2 border-b"><span>Payment to XYZ Store</span><span className="text-gray-500">$50.00</span></li>
        <li className="flex justify-between py-2 border-b"><span>Payment from Client A</span><span className="text-gray-500">$500.00</span></li>
        <li className="flex justify-between py-2 border-b"><span>Payment to ABC Corp</span><span className="text-gray-500">$120.00</span></li>
        <li className="flex justify-between py-2 border-b"><span>Refund from Store B</span><span className="text-gray-500">$30.00</span></li>
      </ul>
      <button className="text-blue-500 mt-4 hover:underline">View All Transactions</button>
    </div>
  );
};

const ExpensesBreakdownCard = ({ darkMode }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"} max-w-sm ml-25`}>
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>
    </div>
  );
};

export default FinancialDashboard;
