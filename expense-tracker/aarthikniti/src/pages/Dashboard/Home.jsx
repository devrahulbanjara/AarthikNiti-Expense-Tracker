import React from 'react';

const SpentBar = ({ spent, budget }) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  
  const getBarColor = () => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold">Spent: ${spent}</span>
        <span className="text-sm font-semibold">Budget: ${budget}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm mt-2 text-gray-600">{percentage.toFixed(1)}% of budget used</p>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Budget Tracker</h1>
      <SpentBar spent={900} budget={999} />
    </div>
  );
};

export default Home;