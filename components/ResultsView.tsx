
import React, { useState } from 'react';
import { ScholarshipAnalysis, EligibilityStatus } from '../types';

interface ResultsViewProps {
  analysis: ScholarshipAnalysis;
  onReset: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ analysis, onReset, onSave, isSaved = false }) => {
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const getStatusColor = (status: EligibilityStatus | string) => {
    if (status.toLowerCase().includes('eligible') && !status.toLowerCase().includes('not')) 
      return 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-emerald-950/20';
    if (status.toLowerCase().includes('not eligible')) 
      return 'bg-rose-500 text-white shadow-rose-100 dark:shadow-rose-950/20';
    return 'bg-amber-500 text-white shadow-amber-100 dark:shadow-amber-950/20';
  };

  const getProbColorClass = (prob: number) => {
    if (prob >= 80) return 'text-emerald-500 dark:text-emerald-400';
    if (prob >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  const getProbBgClass = (prob: number) => {
    if (prob >= 80) return 'bg-emerald-500 dark:bg-emerald-400';
    if (prob >= 50) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-rose-500 dark:bg-rose-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* SECTION: MASTER VERDICT CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20">
        <div className="bg-slate-900 dark:bg-black p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-blue-400 dark:text-blue-300 text-sm font-bold uppercase tracking-widest">Final Verdict</span>
              <h2 className="text-4xl font-black">{analysis.eligibilityStatus}</h2>
              <p className="text-slate-400 max-w-md">Based on your marks, category, and income, here is your path forward.</p>
            </div>
            
            <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto">
              <div className="text-sm font-bold text-blue-300 uppercase mb-2">Approval Probability</div>
              <div className="text-5xl font-black flex items-baseline gap-1">
                <span className={getProbColorClass(analysis.acceptanceProbability)}>{analysis.acceptanceProbability}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${getProbBgClass(analysis.acceptanceProbability)}`}
                  style={{ width: `${analysis.acceptanceProbability}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          
          {/* SECTION: THE "WHY REJECTED" WARNING */}
          <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900/30 rounded-2xl p-6">
            <h3 className="text-rose-800 dark:text-rose-400 font-bold text-xl flex items-center gap-2 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Critical: Why Applications Still Get Rejected
            </h3>
            <p className="text-rose-700 dark:text-rose-300 text-sm mb-4 leading-relaxed font-medium">
              Even after correct document upload, portals like <span className="font-bold">UP Scholarship</span> and <span className="font-bold">NSP</span> often reject candidates at the department level due to these "hidden" failures:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.riskFactors.map((risk, idx) => (
                <div key={idx} className="bg-white/60 dark:bg-slate-800/40 p-3 rounded-lg flex items-start gap-3 border border-rose-200 dark:border-rose-900/30 shadow-sm">
                  <div className="text-rose-500 mt-0.5">•</div>
                  <span className="text-rose-900 dark:text-rose-100 text-sm font-semibold">{risk}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-blue-500 shadow-sm">
              <div className="text-blue-900 dark:text-blue-300 font-bold text-sm mb-1 uppercase tracking-tight">Essential Fix: The NPCI Factor</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Check your <span className="font-bold">Aadhaar-Bank Mapping</span> on the NPCI website immediately. If your bank account is not mapped for <span className="font-bold">Direct Benefit Transfer (DBT)</span>, your scholarship will be rejected by PFMS even if your application is 100% correct.
              </p>
            </div>
          </div>

          {/* SECTION: WHERE TO APPLY (LINKS) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.242a4 4 0 115.656 5.656l-1.103 1.103" /></svg>
              </span>
              Official Scholarship Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.matchedScholarships.length > 0 ? (
                analysis.matchedScholarships.map((s, idx) => (
                  <div key={idx} className="group relative bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-6 transition-all hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">{s.name}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{s.provider}</p>
                      {s.amount && <div className="mt-2 inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">{s.amount}</div>}
                    </div>
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md group-hover:shadow-blue-200"
                    >
                      Visit Application Portal
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center text-slate-400 dark:text-slate-600 font-medium italic">
                  No specific portal matches found for this profile.
                </div>
              )}
            </div>
          </div>

          {/* SECTION: REASONING & CHECKLIST */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">Detailed Analysis</h4>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {analysis.detailedReasoning}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg">Essential Checklist</h4>
              <div className="space-y-2">
                {analysis.actionPlan.essentialDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-10">
        <button
          onClick={handleSave}
          disabled={isSaved || justSaved}
          className={`px-10 py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl ${
            isSaved || justSaved 
              ? 'bg-emerald-500 text-white cursor-default' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1'
          }`}
        >
          {isSaved || justSaved ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              Profile Saved
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Save Results
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="group px-10 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1"
        >
          <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 0118 0z" /></svg>
          Check Another Profile
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
