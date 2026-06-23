import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass = "text-blue-600" }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-gray-100 ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatsCard;