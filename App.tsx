import React, { useState, useEffect } from 'react';
import { analyzeBasketballSituation } from './services/geminiService';
import { RuleAnalysis, HistoryItem, AppView } from './types';
import AnalysisResult from './components/AnalysisResult';
import HistoryCard from './components/HistoryCard';
import RuleBook from './components/RuleBook';
import { 
  Play, 
  History, 
  BookOpen, 
  Send, 
  Loader2, 
  Dribbble, 
  ChevronRight 
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ANALYZE);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<RuleAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('hoopsRuleHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleAnalyze = async () => {
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const result = await analyzeBasketballSituation(inputQuery);
      setCurrentAnalysis(result);

      const newItem: HistoryItem = {
        ...result,
        id: Date.now().toString(),
        query: inputQuery,
        timestamp: Date.now()
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('hoopsRuleHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case AppView.RULEBOOK:
        return <RuleBook />;
      case AppView.HISTORY:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-1">Analysis History</h2>
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No previous analyses found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <HistoryCard key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        );
      case AppView.ANALYZE:
      default:
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Input Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <label htmlFor="scenario" className="block text-sm font-semibold text-gray-700 mb-2">
                Describe the Situation
              </label>
              <textarea
                id="scenario"
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-700 bg-gray-50 placeholder-gray-400 transition-all"
                placeholder="e.g., While running on a fast break, the defender pushed the attacker from behind near the sideline..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !inputQuery.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all
                    ${isLoading || !inputQuery.trim() 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg active:scale-95'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Play
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            {/* Result Section */}
            {currentAnalysis && (
              <AnalysisResult result={currentAnalysis} />
            )}

            {/* Empty State / Prompt */}
            {!currentAnalysis && !isLoading && !error && (
              <div className="text-center py-10 opacity-60">
                <Dribbble className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Describe a play above to get an instant referee decision.</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans pb-20 md:pb-0">
      
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-1.5 rounded-lg">
              <Dribbble className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              HoopRef
            </h1>
          </div>
          {/* Mobile view indicator or settings could go here */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-40 md:hidden pb-safe">
        <button 
          onClick={() => setView(AppView.ANALYZE)}
          className={`flex flex-col items-center gap-1 ${view === AppView.ANALYZE ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Play className="w-6 h-6" />
          <span className="text-xs font-medium">Analyze</span>
        </button>
        <button 
          onClick={() => setView(AppView.HISTORY)}
          className={`flex flex-col items-center gap-1 ${view === AppView.HISTORY ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-xs font-medium">History</span>
        </button>
        <button 
          onClick={() => setView(AppView.RULEBOOK)}
          className={`flex flex-col items-center gap-1 ${view === AppView.RULEBOOK ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-medium">Rules</span>
        </button>
      </nav>

      {/* Desktop Sidebar / Tabs (Optional for larger screens, simple toggle for now) */}
      <div className="hidden md:flex fixed right-8 bottom-8 gap-3">
         {/* A simple desktop floater to switch views if screen is large */}
         <div className="bg-white shadow-xl rounded-full p-2 flex gap-2 border border-gray-200">
            <button 
              onClick={() => setView(AppView.ANALYZE)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === AppView.ANALYZE ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Analyzer
            </button>
            <button 
              onClick={() => setView(AppView.HISTORY)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === AppView.HISTORY ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              History
            </button>
             <button 
              onClick={() => setView(AppView.RULEBOOK)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${view === AppView.RULEBOOK ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Rulebook
            </button>
         </div>
      </div>

    </div>
  );
};

export default App;