
import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import ResultsView from './components/ResultsView';
import { analyzeScholarship } from './services/geminiService';
import { ScholarshipAnalysis, StudentInfo, SavedSearch } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ScholarshipAnalysis | null>(null);
  const [currentStudentInfo, setCurrentStudentInfo] = useState<StudentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem('scholarship_navigator_saved');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved searches", e);
      }
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleFormSubmit = async (info: StudentInfo) => {
    setIsLoading(true);
    setError(null);
    setCurrentStudentInfo(info);
    try {
      const result = await analyzeScholarship(info);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentSearch = () => {
    if (!analysis || !currentStudentInfo) return;
    
    const newSave: SavedSearch = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      studentInfo: currentStudentInfo,
      analysis: analysis
    };
    
    const updated = [newSave, ...savedSearches];
    setSavedSearches(updated);
    localStorage.setItem('scholarship_navigator_saved', JSON.stringify(updated));
  };

  const deleteSavedSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('scholarship_navigator_saved', JSON.stringify(updated));
  };

  const loadSavedSearch = (saved: SavedSearch) => {
    setAnalysis(saved.analysis);
    setCurrentStudentInfo(saved.studentInfo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setCurrentStudentInfo(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-slate-900 dark:to-slate-800 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        
        {/* Dark Mode Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={toggleDarkMode}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5 text-blue-100" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-400/30 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-blue-400/50">
            Expert Academic Consultant
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Scholarship <span className="text-blue-200">Navigator Pro</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
            Find the right funding for your education. Our AI analyzes your profile against thousands of Indian & International scholarships.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 -mt-10">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg shadow-md animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {!analysis ? (
          <>
            <StudentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            
            {/* Saved Searches List */}
            {savedSearches.length > 0 && (
              <div className="mt-12 space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  Your Saved Profiles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedSearches.map((saved) => (
                    <div 
                      key={saved.id}
                      onClick={() => loadSavedSearch(saved)}
                      className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer relative"
                    >
                      <button 
                        onClick={(e) => deleteSavedSearch(saved.id, e)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                        aria-label="Delete saved search"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                          {saved.studentInfo.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {saved.studentInfo.name}
                          </h3>
                          <p className="text-xs text-slate-500">{new Date(saved.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded uppercase">{saved.studentInfo.category}</span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded uppercase">{saved.studentInfo.percentage}% Marks</span>
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">{saved.analysis.acceptanceProbability}% Approval</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <ResultsView 
            analysis={analysis} 
            onReset={resetAnalysis} 
            onSave={saveCurrentSearch} 
            isSaved={savedSearches.some(s => s.studentInfo.name === currentStudentInfo?.name && s.studentInfo.annualIncome === currentStudentInfo?.annualIncome)}
          />
        )}

        {/* Feature Cards */}
        {!analysis && !isLoading && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Instant Eligibility</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Cross-checks your income, marks, and category against major national databases.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.1a2 2 0 00.596 1.414l.39.39M14 3a9 9 0 0110 9" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Global Reach</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Matches you with International grants like Chevening, Rhodes, and Fullbright.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Step-by-Step Guide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Get a customized document checklist and application roadmap for every match.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Scholarship Navigator Pro. Helping students achieve their dreams.</p>
        <p className="mt-2 text-slate-400 dark:text-slate-600">Disclaimer: Information provided is based on AI analysis. Always verify with official scholarship portals.</p>
      </footer>
    </div>
  );
};

export default App;
