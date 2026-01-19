import React from 'react';
import { HistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface HistoryCardProps {
  item: HistoryItem;
  index: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, index }) => {
  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-md border border-indigo-100">
          {item.ruleName}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <Clock size={12} className="mr-1" />
          {new Date(item.timestamp).toLocaleDateString()}
        </div>
      </div>
      
      {/* Show the original query as context */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-3 italic border-l-2 border-gray-200 pl-3">
        "{item.query}"
      </p>

      <div className="text-sm font-bold text-gray-800">
        <span className="text-green-600 uppercase text-xs tracking-wide mr-2">Decision:</span>
        {item.decision}
      </div>
    </div>
  );
};

export default HistoryCard;