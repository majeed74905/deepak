import React from 'react';
import { RuleAnalysis } from '../types';
import { Gavel, BookOpen, AlertCircle, Quote, CheckCircle2, FileText } from 'lucide-react';

interface AnalysisResultProps {
  result: RuleAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
      {/* Header / Verdict */}
      <div className="bg-indigo-900 p-6 text-white">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <Gavel className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Official Decision</span>
        </div>
        <h3 className="text-2xl font-bold leading-tight">{result.decision}</h3>
        <div className="mt-4 flex items-center gap-2 text-indigo-200 text-sm">
          <BookOpen className="w-4 h-4" />
          <span>{result.ruleName}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        
        {/* Step 1: Summary */}
        <section>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Situation Summary
          </h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100">
            {result.summary}
          </p>
        </section>

        {/* Step 2 & 5: Relevant Rules & Citations */}
        <section>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Quote className="w-4 h-4" />
            Applied Rules
          </h4>
          <div className="space-y-2">
            {result.relevantRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-indigo-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {rule}
              </div>
            ))}
          </div>
        </section>

        {/* Step 4: Reasoning */}
        <section>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Detailed Reasoning
          </h4>
          <div className="text-gray-800 leading-7 text-base">
            {result.reasoning}
          </div>
        </section>

        {/* Step 5: Citations Footer */}
        <section className="pt-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rule Book References</h4>
          <div className="flex flex-wrap gap-2">
            {result.citations.map((cite, idx) => (
              <span key={idx} className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100">
                {cite}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AnalysisResult;