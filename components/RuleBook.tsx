import React from 'react';
import { STATIC_RULEBOOK } from '../constants';
import { Book } from 'lucide-react';

const RuleBook: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Book className="w-6 h-6" />
          Quick Rulebook
        </h2>
        <p className="text-indigo-200 mt-1 text-sm">Offline reference for common situations.</p>
      </div>

      <div className="space-y-4">
        {STATIC_RULEBOOK.map((category, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
              {category.category}
            </div>
            <div className="divide-y divide-gray-100">
              {category.rules.map((rule, rIdx) => (
                <div key={rIdx} className="p-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-bold text-gray-900 text-sm">{rule.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{rule.summary}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleBook;