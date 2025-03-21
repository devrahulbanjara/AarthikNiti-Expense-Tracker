import React from "react";

const FinancialDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-4 shadow-md min-h-screen">
        <h2 className="text-xl font-bold mb-4">SmartWise</h2>
        <ul>
          <li className="py-2 px-4 bg-gray-200 rounded-md mb-2">Dashboard</li>
          <li className="py-2 px-4 hover:bg-gray-100 rounded-md">Income</li>
          <li className="py-2 px-4 hover:bg-gray-100 rounded-md">Expenses</li>
          <li className="py-2 px-4 hover:bg-gray-100 rounded-md">Reports</li>
          <li className="py-2 px-4 hover:bg-gray-100 rounded-md">Budgeting & Alerts</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-200 rounded-full">🌙</button>
            <button className="p-2 bg-gray-200 rounded-full">👤</button>
          </div>
        </div>
        <p className="text-gray-600">View your financial overview and recent activity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card title="Total Balance" amount="$12,546.00" change="+2.5% from last month" icon="⚖️" />
          <Card title="Total Income" amount="$4,935.00" change="+10.1% from last month" icon="📈" />
          <Card title="Total Expenses" amount="$2,640.00" change="+3.2% from last month" icon="📉" />
          <BudgetCard percentage={53.5} label="Healthy spending" />
        </div>

        {/* Recent Transactions and Expenses Breakdown side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <RecentTransactionsCard />
          <ExpensesBreakdownCard />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, amount, change, icon }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md text-center">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-semibold">{title}</h2>
        <span>{icon}</span>
      </div>
      <p className="text-xl font-bold mt-2">{amount}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
};

const BudgetCard = () => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md text-center">
      <h2 className="text-md font-semibold">Spent</h2>
      <p className="text-xl font-bold mt-2">53.5%</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `53.5%` }}></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Healthy spending</p>
    </div>
  );
};

const RecentTransactionsCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <ul>
        <li className="flex justify-between py-2 border-b">
          <span>Payment to XYZ Store</span>
          <span className="text-gray-500">$50.00</span>
        </li>
        <li className="flex justify-between py-2 border-b">
          <span>Payment from Client A</span>
          <span className="text-gray-500">$500.00</span>
        </li>
        <li className="flex justify-between py-2 border-b">
          <span>Payment to ABC Corp</span>
          <span className="text-gray-500">$120.00</span>
        </li>
        <li className="flex justify-between py-2 border-b">
          <span>Refund from Store B</span>
          <span className="text-gray-500">$30.00</span>
        </li>
      </ul>
      <button className="text-blue-500 mt-4 hover:underline">View All Transactions</button>
    </div>
  );
};

const ExpensesBreakdownCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Expenses Breakdown</h2>
      
    </div>
  );
};

export default FinancialDashboard;
